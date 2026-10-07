import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

// Lazy so a missing key fails the request, not the build.
// No apiVersion: the SDK pins its own and its types match it.
export function getStripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    client = new Stripe(key, {
      maxNetworkRetries: 2,
      appInfo: {
        name: "francois-poulat",
        url: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  }
  return client;
}
