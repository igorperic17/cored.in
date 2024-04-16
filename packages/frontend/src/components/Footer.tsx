import {
  Flex,
  Text,
  Link,
  Container,
  VStack,
  Heading,
  HStack,
  useMediaQuery
} from "@chakra-ui/react";
import { FaEnvelope, FaHeart } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";

export const Footer = () => {
  const [isLargerThanLG] = useMediaQuery("(min-width: 62em)");

  return (
    <Container
      as="footer"
      maxW="100vw"
      centerContent
      // bg="blackAlpha.50"
      borderTop="1px solid black"
      color="headingBlack"
    >
      <Flex
        // border="1px solid red"
        direction={isLargerThanLG ? "row" : "column"}
        gap={isLargerThanLG ? "" : "3em"}
        justify="space-between"
        align={isLargerThanLG ? "center" : "center"}
        textAlign="center"
        maxW="1200px"
        w="100%"
        px="6"
        py="10"
      >
        <VStack>
          <Heading
            as="h4"
            fontSize="md"
            w="100%"
            color="headingBlack"
            textAlign={isLargerThanLG ? "left" : "center"}
            translate="no"
          >
            YOUR AMAZING COMPANY
          </Heading>
          <Text
            textAlign={isLargerThanLG ? "left" : "center"}
            whiteSpace="pre-line"
            color="headingGrey"
            translate="no"
          >
            {`C/ Some Road 1234
            01234 City
            Country`}
          </Text>
        </VStack>

        {/* <Text mb="3">
          Provided by{" "}
          <Link href="https://cryptonize.world" isExternal color="blue.500">
            Cryptonize.world
          </Link>
        </Text> */}
        <Text
          fontSize="md"
          whiteSpace="pre-line"
          justifySelf="center"
          color="headingGrey"
          order={isLargerThanLG ? "" : "1"}
          ml={isLargerThanLG ? "2em" : "0"}
          translate="no"
          lineHeight="32px"
        >
          {`© Copyright Amazing Company
          All Rights Reserved
          Made with`}{" "}
          <FaHeart style={{ display: "inline", color: "red" }} />
        </Text>

        <VStack>
          <HStack spacing="1em">
            <Link
              as={ReactRouterLink}
              to="mailto:info@yourcompany.world"
              isExternal
            >
              <FaEnvelope size="26px" color="headingBlack" />
            </Link>
          </HStack>
          <Text color="headingGrey" translate="no">
            info@yourcompany.world
          </Text>
          <Link
            as={ReactRouterLink}
            to="/privacy-policy"
            color="headingGrey"
            isExternal
          >
            Privacy Policy
          </Link>
        </VStack>
      </Flex>
    </Container>
  );
};
