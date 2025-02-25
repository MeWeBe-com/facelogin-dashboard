'use client'

import { useSearchParams } from 'next/navigation'

import { redirect } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get('org_id'); 
  if (id) {
    localStorage.setItem('org_id', id)
    redirect("/main/dashboard"); // Redirects users to the login page
  } else {
    redirect("/auth/login"); // Redirects users to the login page
  }

  return null; // This prevents any content from rendering
}