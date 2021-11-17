import Head from "next/head";
import Image from "next/image";
import SiteLayout from "@/layouts/SiteLayout";

export default function Restricted() {
  return (
    <>
      <Head>
        <title>You need to sign in to this page</title>
        <meta name="description" content="generated description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx>{``}</style>
      <div>You need to sign in to this page</div>
    </>
  );
}

Restricted.getLayout = (page) => <SiteLayout>{page}</SiteLayout>;
