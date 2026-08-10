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
 * CSRF: the origin check below is done by hand, as the PHP version did.
 * Astro's security.checkOrigin only engages when buildOutput resolves to
 * 'server', which is not the case under output: 'static' — a cross-origin POST
 * was verified to pass straight through it.
 */

export const prerender = false;

/** Redirect back to the form with a status the page reports client-side. */
const back = (status: string) =>
  new Response(null, { status: 303, headers: { Location: `/contact?${status}` } });

/** Mirrors the form's intent: a blank field counts as absent. */
const field = (data: FormData, key: string) => {
  const value = String(data.get(key) ?? '').trim();
  return value === '' ? '—' : value;
};

/** Strip CR/LF so submitted values cannot smuggle anything into headers. */
const headerSafe = (value: string) => value.replace(/[\r\n]/g, '').trim();

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

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
  if (String(data.get('company') ?? '').trim() !== '') {
    return back('sent=1');
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

  // The From address must be on the domain verified with Resend. The patient's
  // address goes in reply_to instead, so hitting Reply still reaches them.
  const from = headerSafe(env.APPOINTMENT_FROM || `website@${host}`);
  const to = headerSafe(env.APPOINTMENT_TO || 'oasisdentalcarehb@yahoo.com');

  // Checked last so a misconfigured deploy still reports validation errors
  // correctly rather than masking every outcome as a server error.
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('appointment: RESEND_API_KEY is not set');
    return back('error=server');
  }

  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Oasis Dental Care <${from}>`,
        to: [to],
        reply_to: headerSafe(email),
        subject: headerSafe(`Appointment request: ${first} ${last}`),
        html,
      }),
    });
  } catch (err) {
    console.error(`appointment: fetch to Resend failed for ${email} — ${err}`);
    return back('error=server');
  }

  if (!response.ok) {
    console.error(
      `appointment: Resend returned ${response.status} for ${email} — ${await response.text()}`,
    );
    return back('error=server');
  }

  return back('sent=1');
};
