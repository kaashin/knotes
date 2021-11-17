import Nav from "@/components/Headers/Nav";
import AppFooter from "@/components/Footers/AppFooter";

export default function AppLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
      <AppFooter />
    </>
  );
}
