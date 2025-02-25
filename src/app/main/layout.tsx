import Header from "@/components/Header/Header";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />  {/* Header is only included here */}
      {children}
    </>
  );
}
