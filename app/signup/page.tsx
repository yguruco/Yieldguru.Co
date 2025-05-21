import { redirect } from "next/navigation"

export default function SignupRedirect() {
  // Redirect to the investor signup page by default
  // Note: Admin signup is not allowed through the public interface
  redirect("/signup/investor")
}
