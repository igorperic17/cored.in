import { Badge, Heading, Text, VStack } from "@chakra-ui/react";
import { CredentialDTO } from "@coredin/shared";
import { FC } from "react";

type CredentialProps = {
  credential: CredentialDTO;
};

export const Credential: FC<CredentialProps> = ({ credential }) => {
  const { title, establishment, startDate, endDate, verified } = credential;
  return (
    <VStack
      align="start"
      spacing="0.375em"
      borderBottom="2px solid #3E3D3A"
      _last={{ borderBottom: "none" }}
      py="1.5em"
      color={verified ? "text.100" : "text.800"}
    >
      {verified && (
        <Badge variant="verified" mb="0.5em">
          Verified
        </Badge>
      )}
      <Heading
        as="h3"
        fontFamily="body"
        fontSize={{ base: "1.125rem", lg: "1.25rem" }}
      >
        {title}
      </Heading>
      <Text fontSize={{ base: "1.125rem", lg: "1rem" }}>{establishment}</Text>
      <Text fontSize={{ base: "1.125rem", lg: "1rem" }}>
        {startDate} - {endDate || "Present"}
      </Text>
    </VStack>
  );
};
