'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { redirect } from "next/navigation";
import { useCookies } from 'next-client-cookies';

export default function Home() {
  const cookies = useCookies();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('org_id');
    if (id) {
      cookies.set('org_id', id);
      redirect("/main/dashboard");
    } else {
      redirect("/auth/login");
    }
  }, [searchParams]); // Runs whenever search params change

  return null; // Prevents rendering any content
}
