import { redirect } from "next/navigation";

/**
 * Root page – redirects to /login by default.
 * Authenticated users will be redirected to their role dashboard
 * by the AuthProvider / middleware.
 */
export default function RootPage() {
  redirect("/login");
}
