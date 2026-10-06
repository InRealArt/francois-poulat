import { NextResponse } from "next/server";
import { z } from "zod";
import { BrevoClient } from "@getbrevo/brevo";
import { formatSizes } from "@/lib/content";
import { verifyTurnstileToken } from "@/lib/turnstile";

const reservationRequestSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.email(),
  address: z.string().trim().min(2).max(500),
  formatId: z.string().trim().min(1).max(50),
  sizeId: z.string().trim().min(1).max(50),
  currency: z.enum(["EUR", "USD"]),
  captchaToken: z.string().min(1),
});

const RECIPIENT_EMAIL = "teaminrealart@gmail.com";
const SENDER_EMAIL = "no-reply@inrealart.com";
const SENDER_NAME = "InRealArt — Reservations";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = reservationRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { name, email, address, formatId, sizeId, currency, captchaToken } =
    parsed.data;

  // Prices come from the server-side catalog, never from the client.
  const size = formatSizes.find((item) => item.id === sizeId);
  if (!size) {
    return NextResponse.json({ error: "invalid_size" }, { status: 400 });
  }

  const remoteIp = request.headers.get("x-forwarded-for");

  let captchaValid: boolean;
  try {
    captchaValid = await verifyTurnstileToken(captchaToken, remoteIp);
  } catch {
    return NextResponse.json(
      { error: "captcha_verification_failed" },
      { status: 502 }
    );
  }

  if (!captchaValid) {
    return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "email_service_unavailable" },
      { status: 500 }
    );
  }

  const brevo = new BrevoClient({ apiKey });

  const rows = [
    { label: "Client name", value: name },
    { label: "Client email", value: email },
    { label: "Shipping address", value: address },
    { label: "Format", value: formatId },
    { label: "Size", value: size.size },
    { label: "Total", value: `${size.priceTotal} ${currency}` },
    { label: "Deposit (75%)", value: `${size.priceDeposit} ${currency}` },
  ];

  const htmlRows = rows
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #eeeeee;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#999999;white-space:nowrap;vertical-align:top;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:10px 16px;border-bottom:1px solid #eeeeee;font-family:Arial,sans-serif;font-size:14px;color:#131313;">
            ${escapeHtml(value)}
          </td>
        </tr>`
    )
    .join("");

  const htmlContent = `
    <html>
      <body style="margin:0;padding:0;background:#f7f6f4;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f4;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #eeeeee;">
                <tr>
                  <td style="background:#131313;padding:24px 32px;">
                    <span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#b89c72;">InRealArt Agency</span>
                    <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-style:italic;font-weight:400;font-size:22px;color:#ffffff;">
                      New Grim Edition Reservation
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 32px 8px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#444444;">
                    A visitor reserved a print from the Formats section. Contact them within 24h to finalize the deposit payment — reply directly to the client's email.
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 32px 32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;">
                      ${htmlRows}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 32px 32px;font-family:Arial,sans-serif;font-size:11px;color:#999999;border-top:1px solid #eeeeee;">
                    Sent automatically from the InRealArt website reservation form.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const textContent = [
    "New Grim Edition reservation",
    "",
    ...rows.map(({ label, value }) => `${label}: ${value}`),
  ].join("\n");

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: RECIPIENT_EMAIL, name: "InRealArt Team" }],
      replyTo: { email, name },
      subject: `Reservation — ${size.size} — ${name}`,
      htmlContent,
      textContent,
    });
  } catch {
    return NextResponse.json({ error: "email_send_failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
