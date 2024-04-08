import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

import Layout from "@/layout";
import { FlagProvider } from "@unleash/nextjs";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <FlagProvider>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </FlagProvider>
  );
};

export default App;
