import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Box, Flex } from "@chakra-ui/react";
import Head from "next/head";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  return (
    <Flex direction="column" minH="100dvh">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Box flexGrow={1}>{children}</Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
