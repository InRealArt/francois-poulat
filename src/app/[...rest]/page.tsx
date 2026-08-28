import { redirect } from "next/navigation";

// Catches any path whose first segment is not a known locale (e.g. `/test`)
// and sends the visitor to the home page instead of showing a 404.
export default function CatchAllPage() {
  redirect("/");
}
