import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Text } from "@chakra-ui/react";
import SiteLayout from "@/layouts/SiteLayout";
import NoteInputForm from "@/components/NoteInputForm";
import { useSession } from "next-auth/client";

export default function App() {
  const [session, loading] = useSession();
  const router = useRouter();

  console.log({ session, loading });

  if (loading) {
    return <div>Checking credentials...</div>;
  }
  if (!session && !loading) {
    console.log("there is no session");
    router.push("/restricted");
    return null;
  }

  return (
    <>
      <Head>
        <title>App</title>
        <meta name="description" content="generated description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx>{``}</style>
      <div className="flex flex-columns justify-center vh-100">
        <main className="flex flex-row items-center">
          <NoteInputForm />
        </main>
      </div>
    </>
  );
}

App.getLayout = (page) => <SiteLayout>{page}</SiteLayout>;
