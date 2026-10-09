import "server-only";
import { BrevoClient } from "@getbrevo/brevo";

const TEAM_EMAIL = "teaminrealart@gmail.com";
// Only verified Brevo sender for now. Switch to no-reply@inrealart.com once
// the inrealart.com domain is authenticated in Brevo (DKIM/DMARC).
const SENDER_EMAIL = "teaminrealart@gmail.com";

export type EmailRow = { label: string; value: string };
export type EmailSection = { heading: string; body: string };
export type EmailLink = { label: string; url: string };

type Email = {
  to: { email: string; name?: string };
  senderName: string;
  subject: string;
  title: string;
  intro: string;
  // Body text after the rows (closing / signature), same style as the intro.
  outro?: string;
  footer: string;
  rows: EmailRow[];
  links?: EmailLink[];
  sections?: EmailSection[];
  replyTo: { email: string; name?: string };
};

type TeamEmail = Omit<Email, "to">;

// Mail clients fetch the logo over the network, so it must be publicly hosted:
// EMAIL_LOGO_URL overrides the site URL (e.g. when testing from localhost).
function emailLogoUrl() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  return (
    process.env.EMAIL_LOGO_URL ?? `${siteUrl}/images/inrealart/logo-email.png`
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Multi-paragraph text (e.g. CGV articles) keeps its line breaks.
function textToHtml(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

// Throws on missing config or Brevo failure; callers map that to a response.
export async function sendEmail({
  to,
  senderName,
  subject,
  title,
  intro,
  footer,
  outro,
  rows,
  links = [],
  sections = [],
  replyTo,
}: Email) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("Missing BREVO_API_KEY");
  }

  const brevo = new BrevoClient({ apiKey });

  const htmlRows = rows
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #eeeeee;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#999999;white-space:nowrap;vertical-align:top;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:10px 16px;border-bottom:1px solid #eeeeee;font-family:Arial,sans-serif;font-size:14px;color:#131313;">
            ${textToHtml(value)}
          </td>
        </tr>`
    )
    .join("");

  const htmlLinks = links.length
    ? `
                <tr>
                  <td style="padding:0 32px 24px;font-family:Arial,sans-serif;font-size:13px;line-height:2;">
                    ${links
                      .map(
                        ({ label, url }) =>
                          `<a href="${escapeHtml(url)}" style="color:#8a7350;text-decoration:underline;">${escapeHtml(label)}</a>`
                      )
                      .join("<br>")}
                  </td>
                </tr>`
    : "";

  const htmlSections = sections
    .map(
      ({ heading, body }) => `
                <tr>
                  <td style="padding:16px 32px;font-family:Arial,sans-serif;border-top:1px solid #eeeeee;">
                    <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-weight:400;font-size:16px;color:#131313;">${escapeHtml(heading)}</h2>
                    <p style="margin:0;font-size:12px;line-height:1.6;color:#666666;">${textToHtml(body)}</p>
                  </td>
                </tr>`
    )
    .join("");

  const htmlOutro = outro
    ? `
                <tr>
                  <td style="padding:0 32px 24px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#444444;">
                    ${textToHtml(outro)}
                  </td>
                </tr>`
    : "";

  const htmlContent = `
    <html>
      <body style="margin:0;padding:0;background:#f7f6f4;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f4;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #eeeeee;">
                <tr>
                  <td style="background:#131313;padding:24px 32px;">
                    <img src="${escapeHtml(emailLogoUrl())}" width="240" height="28" alt="InRealArt" style="display:block;border:0;width:240px;height:auto;">
                    <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-style:italic;font-weight:400;font-size:22px;color:#ffffff;">
                      ${escapeHtml(title)}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 32px 8px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#444444;">
                    ${textToHtml(intro)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 32px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;">
                      ${htmlRows}
                    </table>
                  </td>
                </tr>${htmlOutro}${htmlLinks}${htmlSections}
                <tr>
                  <td style="padding:16px 32px 32px;font-family:Arial,sans-serif;font-size:11px;color:#999999;border-top:1px solid #eeeeee;">
                    ${textToHtml(footer)}
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
    title,
    "",
    intro,
    "",
    ...rows.map(({ label, value }) => `${label}: ${value}`),
    ...(outro ? ["", outro] : []),
    ...(links.length ? ["", ...links.map(({ label, url }) => `${label}: ${url}`)] : []),
    ...sections.flatMap(({ heading, body }) => ["", heading, body]),
    "",
    footer,
  ].join("\n");

  await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: senderName, email: SENDER_EMAIL },
    to: [to],
    replyTo,
    subject,
    htmlContent,
    textContent,
  });
}

export async function sendTeamEmail(email: TeamEmail) {
  await sendEmail({ ...email, to: { email: TEAM_EMAIL, name: "InRealArt Team" } });
}

export { TEAM_EMAIL };
