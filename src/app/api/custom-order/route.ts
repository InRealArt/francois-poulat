import { NextResponse } from "next/server";
import { z } from "zod";
import { BrevoClient } from "@getbrevo/brevo";

const customOrderRequestSchema = z.object({
  email: z.email(),
  format: z.string().trim().min(2).max(200),
  medium: z.string().trim().min(2).max(200),
  support: z.string().trim().min(2).max(200),
  pokemons: z.string().trim().min(2).max(500),
  captchaToken: z.string().min(1),
});

const RECIPIENT_EMAIL = "teaminrealart@gmail.com";
const SENDER_EMAIL = "no-reply@inrealart.com";
const SENDER_NAME = "InRealArt — Custom Orders";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function verifyTurnstileToken(token: string, remoteIp: string | null) {
  const secretKey = process.env.CLOUDFARE_TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing CLOUDFARE_TURNSTILE_SECRET_KEY");
  }

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  );
  const result = (await response.json()) as { success: boolean };
  return result.success;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = customOrderRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { email, format, medium, support, pokemons, captchaToken } =
    parsed.data;

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
    { label: "Client email", value: email },
    { label: "Desired format", value: format },
    { label: "Desired medium", value: medium },
    { label: "Desired support", value: support },
    { label: "Desired Pokémon", value: pokemons },
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
                      New Custom Order Request
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 32px 8px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#444444;">
                    A visitor submitted a custom project request from the "Dedicated Project" card on the Formats section. Details below — reply directly to the client's email.
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
                    Sent automatically from the InRealArt website custom order form.
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
    "New custom order request",
    "",
    ...rows.map(({ label, value }) => `${label}: ${value}`),
  ].join("\n");

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: RECIPIENT_EMAIL, name: "InRealArt Team" }],
      replyTo: { email },
      subject: `Custom Order Request — ${format}`,
      htmlContent,
      textContent,
    });
  } catch {
    return NextResponse.json({ error: "email_send_failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
