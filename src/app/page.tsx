'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { redirect } from "next/navigation";
import { useCookies } from 'next-client-cookies';

export default function Home() {
  const cookies = useCookies();
  const searchParams = useSearchParams();

  useEffect(() => {
    const referrerDomain = document.referrer;

    const id = searchParams.get('id');
    if (id) {
      cookies.set('org_id', id);
      redirect("/main/dashboard");
    } else {
      redirect("/auth/notfound");
    }
  }, [searchParams]); // Runs whenever search params change

  return null; // Prevents rendering any content
}
