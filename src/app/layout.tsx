import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import BootstrapClient from '@/components/BootstrapClient/BootstrapClient';
import { ToastContainer } from 'react-toastify';
import { CookiesProvider } from 'next-client-cookies/server';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <CookiesProvider>
          {children}
        </CookiesProvider>
        <BootstrapClient />
        <ToastContainer />
      </body>
    </html>
  );
}
