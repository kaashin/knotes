import Head from "next/head";
import Image from "next/image";
import AppLayout from "@/layouts/AppLayout";
import { Text, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/client";

import NotionIntegrations from "@/components/UserSettings/NotionIntegrations";
import ListDatabases from "@/components/UserSettings/ListDatabases";

export default function UserSettings() {
  const [session, sessionLoading] = useSession();

  if (sessionLoading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>User Settings</title>
        <meta name="description" content="generated description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx>{``}</style>
      <div>
        <Text fontSize="xl">Settings</Text>
        <Text fontSize="lg">Notion Integration</Text>
        <NotionIntegrations userId={session.user.userId} />
        <ListDatabases />
      </div>
    </>
  );
}

UserSettings.getLayout = (page) => <AppLayout>{page}</AppLayout>;
