import "tachyons/css/tachyons.css";
import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "next-auth/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import SiteLayout from "@/layouts/SiteLayout";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps, router }) {
  const getLayout =
    Component.getLayout || ((page) => <SiteLayout children={page} />);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider session={pageProps.session}>
        <ChakraProvider>
          {getLayout(<Component {...pageProps} />)}
          <ReactQueryDevtools initialIsOpen={false} />
        </ChakraProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
