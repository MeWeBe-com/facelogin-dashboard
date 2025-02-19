import Header from "@/components/header/Header";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />  {/* Header is only included here */}
        {children}
      </body>
    </html>
  );
}
