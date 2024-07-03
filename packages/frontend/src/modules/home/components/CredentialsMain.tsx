import { useLoggedInServerState } from "@/hooks";
import { ISSUER_QUERIES } from "@/queries/IssuerQueries";
import { ROUTES } from "@/router/routes";
import { Box, Button, Heading, Link, VStack } from "@chakra-ui/react";
import { CredentialRequestStatus } from "@coredin/shared";
import { FaPlus } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";

export const CredentialsMain = () => {
  const { data: pendingRequests } = useLoggedInServerState(
    ISSUER_QUERIES.getRequests(CredentialRequestStatus?.PENDING || "PENDING")
  );

  return (
    <Box layerStyle="cardBox" p="1em" pb="1.5em" mb="4em">
      <Heading as="h1" fontFamily="body" mb="2.5em">
        Credentials
      </Heading>
      <VStack as="ul" spacing="1em" align="start">
        {/* <Box
          as="li"
          _hover={{
            bg: "background.600"
          }}
          w="100%"
          p="0.75em"
          borderRadius="0.5em"
          listStyleType="none"
        >
          <Link as={ReactRouterLink} _hover={{ textDecoration: "none" }}>
            <Heading
              as="h2"
              fontFamily="body"
              fontSize={{ base: "1.25rem", lg: "1.5rem" }}
            >
              My credentials
            </Heading>
          </Link>
        </Box>

        <Box
          as="li"
          _hover={{
            bg: "background.600"
          }}
          w="100%"
          p="0.75em"
          borderRadius="0.5em"
          listStyleType="none"
        >
          <Link as={ReactRouterLink} _hover={{ textDecoration: "none" }}>
            <Heading
              as="h2"
              fontFamily="body"
              fontSize={{ base: "1.25rem", lg: "1.5rem" }}
            >
              Issued credentials
            </Heading>
          </Link>
        </Box> */}

        <Box
          as="li"
          _hover={{
            bg: "background.600"
          }}
          w="100%"
          p="0.75em"
          borderRadius="0.5em"
          listStyleType="none"
        >
          <Link
            as={ReactRouterLink}
            to={ROUTES.CREDENTIALS.INCOMING_REQUESTS.path}
            _hover={{ textDecoration: "none" }}
          >
            <Heading
              as="h2"
              fontFamily="body"
              fontSize={{ base: "1.25rem", lg: "1.5rem" }}
              color={pendingRequests?.length === 0 ? "text.700" : "text.100"}
            >
              Incoming requests: {pendingRequests?.length}
            </Heading>
          </Link>
        </Box>

        <Button
          as={ReactRouterLink}
          to={ROUTES.CREDENTIALS.REQUEST.path}
          variant="primary"
          size="md"
          leftIcon={<FaPlus fontSize="1rem" />}
          iconSpacing="1em"
          mt="4em"
          w="100%"
        >
          Request new credential
        </Button>
      </VStack>
    </Box>
  );
};
