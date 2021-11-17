import Head from "next/head";
import Image from "next/image";
import AppLayout from "@/layouts/AppLayout";
import clog from "clog";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { Text } from "@chakra-ui/react";
import { useSession, getSession } from "next-auth/client";

export default function NotionCallback(props) {
  const { code, state, userId } = props;
  const [session, sessionLoading] = useSession();

  // ===========================================================================
  // Queries
  // ===========================================================================
  const { isLoading, data, isError, error } = useQuery(
    "",
    async () => {
      const response = await axios.post(`/api/notion-auth`, {
        payload: {
          userId,
          code,
          state,
        },
      });
      return response.data.payload;
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  // ===========================================================================
  // Render
  // ===========================================================================

  if (isLoading) {
    return (
      <>
        <PageHead />
        <style jsx>{``}</style>
        <div>Waiting for authorization...</div>
      </>
    );
  }

  if (isError) {
    console.log({ error });
    return (
      <>
        <PageHead />
        <style jsx>{``}</style>
        <div>
          <Text fontSize="xl">There is was an error</Text>
          <Text color="red"></Text>
        </div>
      </>
    );
  }

  console.log({ data });

  return (
    <>
      <PageHead />
      <style jsx>{``}</style>
      <div>
        <Text fontSize="xl">Integration successful</Text>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const session = await getSession(context);

  return {
    props: {
      code: query.code ?? null,
      state: query.state ?? null,
      error: query.error ?? null,
      userId: session.user.userId,
    }, // will be passed to the page component as props
  };
}

NotionCallback.getLayout = (page) => <AppLayout>{page}</AppLayout>;

const PageHead = () => {
  return (
    <Head>
      <title>title</title>
      <meta name="description" content="generated description" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
