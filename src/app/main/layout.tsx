import Header from "@/components/Header/Header";

const MainLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />  {/* Header is only included here */}
      {children}
    </>
  );
}

export default MainLayout;
