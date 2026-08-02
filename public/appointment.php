<?php
declare(strict_types=1);

/**
 * Appointment request handler — Apache/PHP hosting (SiteGround).
 *
 * Sends via PHP's built-in mail(), so there is no API key, no third-party
 * account and no manual DNS setup. It works as soon as the file is uploaded.
 *
 * DELIVERABILITY WARNING
 * Mail sent this way from a shared-hosting IP is frequently spam-filed, and
 * the destination here is a Yahoo address — Yahoo has enforced sender
 * authentication strictly since February 2024. Two things make this far more
 * reliable, both done in SiteGround rather than in this file:
 *   1. Host email for oasisdentalcarehb.com at SiteGround. SPF and DKIM are
 *      then configured automatically.
 *   2. Set APPOINTMENT_FROM to a real mailbox on that domain.
 * Send a test request and check the spam folder before trusting this.
 *
 * There is no delivery confirmation: mail() reports that the message was
 * handed to the local mail server, not that it arrived.
 *
 * Config (SiteGround: Site Tools > Devs > Environment Variables, or SetEnv in
 * .htaccess, which Apache never serves):
 *   APPOINTMENT_TO    defaults to the address published on the site
 *   APPOINTMENT_FROM  must be on this domain, or SPF fails
 */

/** Redirect back to the form with a status the page reports client-side. */
function back(string $status): void
{
    header('Location: /contact?' . $status, true, 303);
    exit;
}

/** Mirrors the form's intent: a blank field counts as absent. */
function field(string $key): string
{
    $value = trim((string) ($_POST[$key] ?? ''));
    return $value === '' ? '—' : $value;
}

/** Strip CR/LF so submitted values can never inject extra mail headers. */
function headerSafe(string $value): string
{
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], '', $value));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    back('error=server');
}

// CSRF origin check. Browsers send Origin on same-origin form POSTs; a
// cross-site post will not match. (Astro applies the same check to its own
// routes automatically via security.checkOrigin.)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = $_SERVER['HTTP_HOST'] ?? '';
if ($origin === '' || parse_url($origin, PHP_URL_HOST) !== $host) {
    error_log('appointment: rejected cross-origin POST from ' . ($origin ?: 'no origin'));
    http_response_code(403);
    exit;
}

// Bots fill every field they find; real users never see this one.
if (trim((string) ($_POST['company'] ?? '')) !== '') {
    back('sent=1');
}

$first = trim((string) ($_POST['first_name'] ?? ''));
$last  = trim((string) ($_POST['last_name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));

if ($first === '' || $last === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    back('error=invalid');
}

$fields = [
    'Name'           => $first . ' ' . $last,
    'Email'          => $email,
    'Phone'          => field('phone'),
    'Service'        => field('service'),
    'Preferred time' => field('preferred_time'),
    'Message'        => field('message'),
];

$body = '<html><body style="font-family:system-ui,sans-serif;font-size:15px;color:#0d1f1d">'
    . '<h2 style="font-size:17px">New appointment request</h2>';
foreach ($fields as $label => $value) {
    $body .= '<p style="margin:6px 0"><strong>' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . ':</strong> '
        . nl2br(htmlspecialchars($value, ENT_QUOTES, 'UTF-8')) . '</p>';
}
$body .= '<p style="margin-top:18px;color:#4a6b65;font-size:13px">Sent from the appointment form on '
    . htmlspecialchars($host, ENT_QUOTES, 'UTF-8') . '. Reply directly to reach the patient.</p>'
    . '</body></html>';

$to = headerSafe(getenv('APPOINTMENT_TO') ?: 'oasisdentalcarehb@yahoo.com');

// The From address must be on this domain or SPF fails and the message is
// spam-filed. The patient's address goes in Reply-To instead, so hitting
// Reply in the inbox still replies to them.
$from = headerSafe(getenv('APPOINTMENT_FROM') ?: 'website@' . $host);

$subject = 'Appointment request: ' . $first . ' ' . $last;
if (function_exists('mb_encode_mimeheader')) {
    $subject = mb_encode_mimeheader($subject, 'UTF-8', 'B');
}
$subject = headerSafe($subject);

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Oasis Dental Care <' . $from . '>',
    'Reply-To: ' . headerSafe($email),
]);

// -f sets the envelope sender, which many shared hosts require for SPF to pass.
$sent = mail($to, $subject, $body, $headers, '-f' . $from);

if (!$sent) {
    error_log('appointment: mail() failed for ' . $email);
    back('error=server');
}

back('sent=1');
