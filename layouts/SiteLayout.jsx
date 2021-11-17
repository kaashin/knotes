import Nav from "@/components/Headers/Nav";
import SiteFooter from "@/components/Footers/SiteFooter";

export default function SiteLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
      <SiteFooter />
    </>
  );
}
