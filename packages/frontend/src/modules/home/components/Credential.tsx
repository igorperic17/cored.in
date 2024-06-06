import { Badge, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { CredentialDTO } from "@coredin/shared";
import { FC } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

type CredentialProps = {
  credential: CredentialDTO;
};

export const Credential: FC<CredentialProps> = ({ credential }) => {
  const { title, establishment, startDate, endDate, verified, issuer } =
    credential;
  return (
    <VStack
      align="start"
      spacing="1em"
      borderBottom="2px solid #3E3D3A"
      _last={{ borderBottom: "none" }}
      py="1.5em"
      color={verified ? "text.100" : "text.800"}
    >
      {verified && issuer && (
        <>
          <Badge variant="verified">Verified</Badge>
        </>
      )}

      <VStack align="start" spacing="0.25em">
        <Heading
          as="h3"
          fontFamily="body"
          fontSize={{ base: "1rem", lg: "1.25rem" }}
        >
          {title}
        </Heading>
        <Text fontSize={{ base: "0.875rem", lg: "1rem" }}>{establishment}</Text>
        <Text fontSize={{ base: "0.875rem", lg: "1rem" }}>
          {startDate} — {endDate || "Present"}
        </Text>
      </VStack>

      {verified && issuer && (
        <Text fontSize={{ base: "0.875rem", lg: "1rem" }}>
          {`Verified by `}
          <Link as={ReactRouterLink} _hover={{ color: "brand.500" }}>
            {issuer}
          </Link>
        </Text>
      )}
    </VStack>
  );
};
