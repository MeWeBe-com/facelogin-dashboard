'use client'

import { useSearchParams } from 'next/navigation'

import { redirect } from "next/navigation";
import { useCookies } from 'next-client-cookies';

export default function Home() {
  const cookies = useCookies();
  const searchParams = useSearchParams();
  const id = searchParams.get('org_id'); 
    console.log(id)
  if (id) {
    cookies.set('org_id', id)
    redirect("/main/dashboard"); // Redirects users to the login page
  } else {
    redirect("/auth/login"); // Redirects users to the login page
  }

  return null; // This prevents any content from rendering
}