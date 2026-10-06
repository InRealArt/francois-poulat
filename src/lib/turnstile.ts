export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | null
) {
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
