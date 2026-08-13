import type { APIRoute } from 'astro';

/**
 * Appointment request handler — Cloudflare Pages.
 *
 * The only on-demand route in the build; every page is still prerendered.
 * Replaces the previous public/appointment.php, which relied on Apache and
 * PHP's mail() and cannot run here.
 *
 * Sends through Resend's HTTP API rather than the SDK: the SDK pulls in Node
 * builtins and would require the nodejs_compat flag on the Worker, while a
 * single fetch has no such requirement and no dependency to keep updated.
 *
 * DELIVERABILITY
 * The destination is a Yahoo address, and Yahoo has enforced sender
 * authentication strictly since February 2024. For mail to land:
 *   1. Verify oasisdentalcarehb.com in the Resend dashboard and add the DNS
 *      records it gives you (SPF + DKIM) to Cloudflare DNS.
 *   2. Leave APPOINTMENT_FROM on that verified domain.
 * Unlike PHP's mail(), Resend reports a real send result, so a failure here is
 * a genuine failure rather than a silent drop — but a successful send still is
 * not proof of inbox placement. Send a test and check the spam folder.
 *
 * Config — Cloudflare Pages > Settings > Environment variables:
 *   RESEND_API_KEY    required; mark as a secret
 *   APPOINTMENT_TO    defaults to the address published on the site
 *   APPOINTMENT_FROM  must be on the domain verified with Resend
 *
 * CSRF: the origin check below is done by hand, as the PHP version did — but
 * note Astro's own security.checkOrigin is ALSO active in production here.
 * Adding this one on-demand route flips the whole build's buildOutput to
 * 'server', which turns Astro's built-in check on by default (confirmed via
 * the built manifest: "checkOrigin":true). Astro's check runs first and
 * rejects a bad Origin with its own bare 403 before this handler ever sees
 * the request. The explicit check below is what makes a bad Origin land on
 * the friendly /contact?error= redirect instead — it is not, as previously
 * assumed, the only thing standing between this route and a forged POST.
 */

export const prerender = false;

/** Redirect back to the form with a status the page reports client-side. */
const back = (status: string) =>
  new Response(null, { status: 303, headers: { Location: `/contact?${status}` } });

/** Redirect to the standalone confirmation page on a successful send. */
const success = () => new Response(null, { status: 303, headers: { Location: '/thank-you' } });

/** Mirrors the form's intent: a blank field counts as absent. */
const field = (data: FormData, key: string) => {
  const value = String(data.get(key) ?? '').trim();
  return value === '' ? '—' : value;
};

/** Strip CR/LF so submitted values cannot smuggle anything into headers. */
const headerSafe = (value: string) => value.replace(/[\r\n]/g, '').trim();

/**
 * Reads a configured address, unwrapping the shapes a dashboard paste tends to
 * arrive in — "a@b.com", <a@b.com>, Name <a@b.com> — and falling back to the
 * built-in default when what is left is not a single address.
 *
 * Worth the trouble because Resend rejects the entire payload with a bare 422
 * for any of those, and the message it returns blames `example.com`, which
 * sends you looking at something that is not the problem.
 */
const address = (label: string, configured: string | undefined, fallback: string) => {
  const raw = headerSafe(configured ?? '').replace(/^["'\s]+|["'\s]+$/g, '');
  const bare = /<([^>]*)>[^>]*$/.exec(raw)?.[1].trim() ?? raw;
  if (/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(bare)) return bare;
  if (raw !== '') {
    console.error(`appointment: ${label}="${raw}" is not a single email address — using ${fallback}`);
  }
  return fallback;
};

/**
 * Turns Resend's least useful rejection into an actionable log line.
 *
 * A 422 on the `to` field reads "Please use our testing email address instead
 * of domains like `example.com`" even when the recipient is an ordinary
 * mailbox. What it actually means is that the account is not cleared to send
 * to arbitrary recipients: either the From domain is not verified, or From is
 * the shared onboarding@resend.dev sandbox sender. In both states Resend
 * delivers only to the Resend account owner's own address and refuses every
 * other recipient with this same misleading message.
 */
const hint = (failure: string, from: string) => {
  if (!/invalid `to` field/i.test(failure)) return '';
  return from.endsWith('@resend.dev')
    ? ' — APPOINTMENT_FROM is the resend.dev sandbox sender, which only delivers to the Resend' +
        ' account owner\'s own address. Verify a domain at resend.com/domains and move' +
        ' APPOINTMENT_FROM onto it, or set APPOINTMENT_TO to that account address to smoke-test.'
    : ' — this Resend account is not cleared to send to arbitrary recipients. Check that the' +
        ' From domain is verified at resend.com/domains.';
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

/**
 * POSTs one message to Resend's API. Throws on a non-2xx response or a network
 * failure; otherwise returns the message id Resend assigns.
 *
 * The id is worth carrying back out: nobody on the web team has access to the
 * practice's mailbox, so the id is the only way to follow a specific
 * submission through to a delivery result — paste it into the Emails view at
 * resend.com/emails and it reports what Yahoo's servers actually did with it.
 */
async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${body}`);
  }
  try {
    return String((JSON.parse(body) as { id?: string }).id ?? '') || 'unknown';
  } catch {
    return 'unknown';
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  // On Cloudflare, bindings and env vars arrive on locals.runtime.env; falling
  // back to import.meta.env keeps `astro dev` working from a local .env file.
  const env = {
    ...import.meta.env,
    ...((locals as any).runtime?.env ?? {}),
  } as Record<string, string | undefined>;

  // Browsers send Origin on same-origin form POSTs; a cross-site post will not
  // match. A missing Origin is rejected too, matching the PHP handler.
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin !== url.origin) {
    console.error(`appointment: rejected cross-origin POST from ${origin ?? 'no origin'}`);
    return new Response('Cross-site form submissions are forbidden', { status: 403 });
  }

  const data = await request.formData();

  // Bots fill every field they find; real users never see this one.
  if (String(data.get('hp_verify') ?? '').trim() !== '') {
    return success();
  }

  const first = String(data.get('first_name') ?? '').trim();
  const last = String(data.get('last_name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();

  // Deliberately permissive, matching FILTER_VALIDATE_EMAIL's practical effect:
  // reject the obviously malformed, never a real address.
  //
  // The failing fields are named in the redirect so the page can point at the
  // specific controls rather than showing one generic "check your details"
  // message — WCAG 3.3.1 requires the item in error to be identified.
  const invalid: string[] = [];
  if (first === '') invalid.push('first_name');
  if (last === '') invalid.push('last_name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid.push('email');
  if (invalid.length) {
    return back(`error=invalid&fields=${invalid.join(',')}`);
  }

  const fields: Record<string, string> = {
    Name: `${first} ${last}`,
    Email: email,
    Phone: field(data, 'phone'),
    Service: field(data, 'service'),
    'Preferred time': field(data, 'preferred_time'),
    Message: field(data, 'message'),
  };

  const host = url.host;

  const rows = Object.entries(fields)
    .map(
      ([label, value]) =>
        `<p style="margin:6px 0"><strong>${escapeHtml(label)}:</strong> ` +
        `${escapeHtml(value).replace(/\n/g, '<br />')}</p>`,
    )
    .join('');

  const html =
    '<html><body style="font-family:system-ui,sans-serif;font-size:15px;color:#0d1f1d">' +
    '<h2 style="font-size:17px">New appointment request</h2>' +
    rows +
    '<p style="margin-top:18px;color:#4a6b65;font-size:13px">Sent from the appointment form on ' +
    `${escapeHtml(host)}. Reply directly to reach the patient.</p>` +
    '</body></html>';

  // The From address must be on the domain verified with Resend — the *only*
  // domain that's ever verified is the production one, so the fallback must
  // be that fixed domain rather than the request's own host. Falling back to
  // `website@${host}` would silently point at an unverified pages.dev/preview
  // host on any deploy other than production, and Resend would reject every
  // send with no visible cause besides the generic error=server redirect.
  //
  // Both go through address() rather than being read raw: these are the two
  // values most likely to have been typed into a dashboard field, and a stray
  // pair of quotes around one of them is otherwise indistinguishable from a
  // genuine Resend outage.
  const from = address('APPOINTMENT_FROM', env.APPOINTMENT_FROM, 'website@oasisdentalcarehb.com');
  const to = address('APPOINTMENT_TO', env.APPOINTMENT_TO, 'oasisdentalcarehb@yahoo.com');

  // Checked last so a misconfigured deploy still reports validation errors
  // correctly rather than masking every outcome as a server error.
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('appointment: RESEND_API_KEY is not set');
    return back('error=server');
  }

  try {
    const id = await sendEmail(apiKey, {
      from: `Oasis Dental Care <${from}>`,
      to: [to],
      reply_to: headerSafe(email),
      subject: headerSafe(`Appointment request: ${first} ${last}`),
      html,
    });
    // Successes are logged as well as failures, because "the form is silently
    // eating requests" is otherwise unfalsifiable from outside the practice's
    // mailbox. Deliberately no patient name or address here — this line says
    // a request was accepted, not who sent it; the failure paths below carry
    // the address only because you cannot chase a bounce without it.
    console.log(`appointment: accepted by Resend for ${to} — id=${id}`);
  } catch (err) {
    // The effective from/to are logged, not just the error: every realistic
    // cause of a failure here is one of those two values being something other
    // than what the dashboard appears to say, and without them in the log
    // there is no way to tell a bad address from a bad API key from an outage.
    const failure = String(err);
    console.error(
      `appointment: send to practice failed — from="${from}" to="${to}" ` +
        `patient="${email}" — ${failure}${hint(failure, from)}`,
    );
    return back('error=server');
  }

  // Confirmation to the patient. Best-effort: the request is already safely
  // in the practice's inbox, so a failure here must not tell the patient
  // their request failed.
  try {
    const id = await sendEmail(apiKey, {
      from: `Oasis Dental Care <${from}>`,
      to: [headerSafe(email)],
      reply_to: to,
      subject: 'We got your appointment request — Oasis Dental Care',
      html:
        `<html><body style="font-family:system-ui,sans-serif;font-size:15px;color:#0d1f1d">` +
        `<h2 style="font-size:17px">Thanks, ${escapeHtml(first)}.</h2>` +
        `<p style="margin:6px 0">We received your appointment request and will reach out shortly ` +
        `to confirm a time${field(data, 'preferred_time') !== '—' ? ' near your preferred time' : ''}.</p>` +
        `<p style="margin:6px 0">If anything about your request needs updating in the meantime, ` +
        `just reply to this email.</p>` +
        `<p style="margin-top:18px;color:#4a6b65;font-size:13px">Oasis Dental Care</p>` +
        `</body></html>`,
    });
    // Id only, no address: the patient's own copy is not something anyone
    // needs to chase, and this line would otherwise put a patient's email in
    // the Cloudflare log on every single successful submission.
    console.log(`appointment: patient confirmation accepted by Resend — id=${id}`);
  } catch (err) {
    const failure = String(err);
    console.error(
      `appointment: confirmation to patient failed (the request itself was delivered) — ` +
        `from="${from}" to="${email}" — ${failure}${hint(failure, from)}`,
    );
  }

  return success();
};
