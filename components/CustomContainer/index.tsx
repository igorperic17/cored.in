import { Container } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

const CustomContainer = ({ children }: PropsWithChildren<unknown>) => {
  return <Container maxW="7xl">{children}</Container>;
};

export default CustomContainer;
