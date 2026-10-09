import { NextResponse } from "next/server";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendEmail, sendTeamEmail, TEAM_EMAIL } from "@/lib/orderEmail";
import { customFormatSizes } from "@/lib/content";
import { routing } from "@/i18n/routing";

const customOrderRequestSchema = z.object({
  email: z.email(),
  format: z.enum(customFormatSizes),
  medium: z.string().trim().min(2).max(200),
  support: z.string().trim().min(2).max(200),
  pokemons: z.string().trim().min(2).max(500),
  captchaToken: z.string().min(1),
  locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = customOrderRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { email, format, medium, support, pokemons, captchaToken, locale } =
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

  const rows = [
    { label: "Email du client", value: email },
    { label: "Format souhaité", value: format },
    { label: "Medium souhaité", value: medium },
    { label: "Support souhaité", value: support },
    { label: "Personnages souhaités", value: pokemons },
    { label: "Langue du site", value: locale.toUpperCase() },
  ];

  try {
    await sendTeamEmail({
      senderName: "InRealArt — Demandes sur-mesure",
      subject: `[Demande de devis] Pikapoulat Grim Valorant — Curation privée — ${format} — ${email}`,
      title: "Nouvelle demande de projet sur-mesure",
      intro:
        "Un visiteur a envoyé une demande de projet sur-mesure depuis le formulaire « Curation privée » de la section Formats. Détails ci-dessous — répondez directement à cet email pour écrire au client.",
      footer:
        "Envoyé automatiquement par le formulaire de demande sur-mesure du site InRealArt.",
      rows,
      replyTo: { email },
    });
  } catch (error) {
    console.error("[custom-order]", error);
    return NextResponse.json({ error: "email_send_failed" }, { status: 502 });
  }

  // The team already has the request: a failed acknowledgement is only logged.
  try {
    const t = await getTranslations({ locale, namespace: "customOrderEmail" });
    const tForm = await getTranslations({ locale, namespace: "customOrderModal" });

    await sendEmail({
      to: { email },
      senderName: "InRealArt",
      subject: t("subject"),
      title: t("title"),
      intro: t("intro"),
      outro: t("outro"),
      footer: t("footer", { email: TEAM_EMAIL }),
      // The address is unverified: echo only the validated format, never free
      // text, so the form cannot relay arbitrary content from our sender.
      rows: [{ label: tForm("formatLabel"), value: format }],
      replyTo: { email: TEAM_EMAIL, name: "InRealArt" },
    });
  } catch (error) {
    console.error("[custom-order] client acknowledgement", error);
  }

  return NextResponse.json({ success: true });
}
