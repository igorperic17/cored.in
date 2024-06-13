import { VStack } from "@chakra-ui/react";
import { CredentialSection, CredentialSectionProps } from "./CredentialSection";
import { FC } from "react";

export type CredentialsContainerProps = {
  sections: CredentialSectionProps[];
};

export const CredentialsContainer: FC<CredentialsContainerProps> = ({
  sections
}) => {
  return (
    <VStack align="start" p="1em" spacing="3em" layerStyle="cardBox">
      {/* Handle the case when there are no credentials */}
      {/* <Text textStyle="sm" alignSelf="center">
        There are no credentials here yet.
      </Text> */}
      {sections.map((section, index) => {
        return (
          <CredentialSection
            key={`credential-section-${index}`}
            section={section.section}
            credentials={section.credentials}
          />
        );
      })}
    </VStack>
  );
};
