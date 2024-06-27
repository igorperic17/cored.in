import { Box, Button, Flex, HStack, Heading, Icon } from "@chakra-ui/react";
import { CredentialDTO } from "@coredin/shared";
import { FC } from "react";
import { Credential } from "./Credential";
import { FaPlus } from "react-icons/fa6";
import MerkleTree from "merkletreejs";

export type CredentialSectionProps = {
  section: string;
  credentials: CredentialDTO[];
  tree: MerkleTree;
  showEdit: boolean;
};

export const CredentialSection: FC<CredentialSectionProps> = ({
  section,
  credentials,
  tree,
  showEdit
}) => {
  if (credentials.length === 0) {
    return;
  }

  return (
    <Box as="section" w="100%">
      <Flex justify="space-between" align="center" mb="0.75em">
        <Heading
          as="h2"
          fontFamily="body"
          fontSize={{ base: "1.25rem", lg: "1.75rem" }}
        >
          {section.toUpperCase()}
        </Heading>
        {showEdit && (
          <Button
            variant="empty"
            color="text.400"
            aria-label={`Add ${section}.`}
          >
            <Icon as={FaPlus} fontSize="1.5rem" />
          </Button>
        )}
      </Flex>
      {credentials.map((cred, index) => (
        <Credential
          key={`credential-${index}`}
          credential={cred}
          tree={tree}
          showOptions={showEdit}
        />
      ))}
    </Box>
  );
};
