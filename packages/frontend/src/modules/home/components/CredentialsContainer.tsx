import { Text, VStack } from "@chakra-ui/layout";
import { credentialsTestData } from "../constants/credentialsTestData";
import { CredentialSection, CredentialSectionProps } from "./CredentialSection";

export const CredentialsContainer = () => {
  return (
    <VStack align="start" p="1em" spacing="3em">
      {Object.entries(credentialsTestData).map(
        ([section, credentials], index) => {
          return (
            <CredentialSection
              key={`credential-section-${index}`}
              section={section}
              credentials={credentials}
            />
          );
        }
      )}
    </VStack>
  );
};
