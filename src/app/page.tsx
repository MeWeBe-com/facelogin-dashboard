'use client'

import { useEffect } from 'react';
import { useSearchParams, redirect } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const referrerDomain = document.referrer;

    const id = searchParams.get('id');
    if (id) {
      localStorage.setItem('id' , id);
      setTimeout(() => {
        redirect(`/main/dashboard`);
      }, 100)
    }
  }, [searchParams]); // Runs whenever search params change

  return null; // Prevents rendering any content
}
