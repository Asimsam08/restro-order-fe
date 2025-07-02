import Header from "@/design-system/Organisms/Header";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PrivateLayout;
