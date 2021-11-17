import Head from "next/head";
import Image from "next/image";
import AppLayout from "@/layouts/AppLayout";

export default function IntegrationSuccess() {
  return (
    <>
      <Head>
        <title>Integration Success</title>
        <meta name="description" content="generated description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx>{``}</style>
      <div>Integration Success</div>
    </>
  );
}

IntegrationSuccess.getLayout = (page) => <AppLayout>{page}</AppLayout>;
