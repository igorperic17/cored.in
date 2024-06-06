import { Box, Text, VStack } from "@chakra-ui/react";
import { credentialsTestData } from "../constants/credentialsTestData";
import { CredentialSection, CredentialSectionProps } from "./CredentialSection";

export const CredentialsContainer = () => {
  return (
    <VStack align="start" p="1em" spacing="3em" layerStyle="cardBox">
      {/* Handle the case when there are no credentials */}
      {/* <Text textStyle="sm" alignSelf="center">
        There are no credentials here yet.
      </Text> */}
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
