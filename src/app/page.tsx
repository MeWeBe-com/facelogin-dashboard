import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login"); // Redirects users to the login page
  return null; // This prevents any content from rendering
}