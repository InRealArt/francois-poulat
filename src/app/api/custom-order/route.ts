import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendTeamEmail } from "@/lib/orderEmail";

const customOrderRequestSchema = z.object({
  email: z.email(),
  format: z.string().trim().min(2).max(200),
  medium: z.string().trim().min(2).max(200),
  support: z.string().trim().min(2).max(200),
  pokemons: z.string().trim().min(2).max(500),
  captchaToken: z.string().min(1),
});

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

  const rows = [
    { label: "Client email", value: email },
    { label: "Desired format", value: format },
    { label: "Desired medium", value: medium },
    { label: "Desired support", value: support },
    { label: "Desired Characters", value: pokemons },
  ];

  try {
    await sendTeamEmail({
      senderName: "InRealArt — Custom Orders",
      subject: `Custom Order Request — ${format}`,
      title: "New Custom Order Request",
      intro:
        'A visitor submitted a custom project request from the "Dedicated Project" card on the Formats section. Details below — reply directly to the client\'s email.',
      footer:
        "Sent automatically from the InRealArt website custom order form.",
      rows,
      replyTo: { email },
    });
  } catch (error) {
    console.error("[custom-order]", error);
    return NextResponse.json({ error: "email_send_failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
