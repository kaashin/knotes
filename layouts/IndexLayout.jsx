export default function IndexLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <IndexFooter />
    </>
  );
}
