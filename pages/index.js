import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

import { Text } from "@chakra-ui/react";
import { getSession } from "next-auth/client";

import NoteInputForm from "@/components/NoteInputForm";

export default function Home({ session }) {
  const [isNewPage, setIsNewPage] = useState(false);
  // ===========================================================================
  // Render
  // ===========================================================================
  if (!session) {
    return (
      <div className="flex flex-columns justify-center vh-100 ">
        <Head>
          <title>Blitz Notion</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="5xl">Blitz Notion</Text>
      </div>
    );
  } else {
    return (
      <div className="flex flex-columns justify-center vh-100">
        <main className="flex flex-row items-center">
          <NoteInputForm />
        </main>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const { query } = context;
  const session = await getSession(context);

  return {
    props: {
      session,
    }, // will be passed to the page component as props
  };
}

// Home.getLayout = (page) => <SiteLayout>{page}</SiteLayout>;
