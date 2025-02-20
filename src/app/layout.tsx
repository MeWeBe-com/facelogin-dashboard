"use client";

import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";

import { useEffect } from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min").then((bootstrap) => {
      window.bootstrap = bootstrap; // ✅ Make Bootstrap available globally
    });
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
