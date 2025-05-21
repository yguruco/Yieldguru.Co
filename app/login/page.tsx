import { redirect } from "next/navigation"

export default function LoginRedirect() {
  // Redirect to the unified login page
  redirect("/login/unified")
}
