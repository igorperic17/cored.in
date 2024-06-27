import { Box, HStack, Heading, VStack } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa6";

export const CredentialsMain = () => {
  return (
    <Box layerStyle="cardBox" p="1em" pb="1.5em" mb="4em">
      <Heading as="h1" fontFamily="body" mb="2.5em">
        Credentials
      </Heading>
      <VStack spacing="2em" align="start">
        <HStack spacing="1em">
          <Heading
            as="h2"
            fontFamily="body"
            fontSize={{ base: "1.25rem", lg: "1.5rem" }}
          >
            My credentials
          </Heading>
          <FaArrowRight />
        </HStack>

        <HStack spacing="1em">
          <Heading
            as="h2"
            fontFamily="body"
            fontSize={{ base: "1.25rem", lg: "1.5rem" }}
          >
            Issued credentials
          </Heading>
          <FaArrowRight />
        </HStack>

        {/* Should this lead to a different page or render the requests here? */}
        <HStack>
          <Heading
            as="h2"
            fontFamily="body"
            fontSize={{ base: "1.25rem", lg: "1.5rem" }}
            color="text.700" // conditionally change the color
          >
            Incoming requests:
          </Heading>
        </HStack>
      </VStack>
    </Box>
  );
};

// My credentials
// Incoming requests
// Issued credentials
