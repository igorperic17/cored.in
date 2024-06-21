import { Button, Icon, VStack } from "@chakra-ui/react";
import { CredentialSection, CredentialSectionProps } from "./CredentialSection";
import { FC } from "react";
import { FaPlus } from "react-icons/fa6";

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
      {sections.length === 0 ? (
        sections.map((section, index) => {
          return (
            <CredentialSection
              key={`credential-section-${index}`}
              section={section.section}
              credentials={section.credentials}
              tree={section.tree}
            />
          );
        })
      ) : (
        <Button
          variant="empty"
          color="brand.500"
          rightIcon={<FaPlus fontSize="1rem" />}
          iconSpacing="1em"
          mx="auto"
        >
          Add a credential
        </Button>
      )}
    </VStack>
  );
};
