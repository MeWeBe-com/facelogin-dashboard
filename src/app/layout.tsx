"use client";

import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import BootstrapClient from '@/components/BootstrapClient/BootstrapClient';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        {children}
        <BootstrapClient />
        <ToastContainer />
      </body>
    </html>
  );
}
