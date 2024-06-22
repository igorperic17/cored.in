import { Button, Icon, VStack } from "@chakra-ui/react";
import { CredentialSection, CredentialSectionProps } from "./CredentialSection";
import { FC } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";

export type CredentialsContainerProps = {
  sections: CredentialSectionProps[];
};

export const CredentialsContainer: FC<CredentialsContainerProps> = ({
  sections
}) => {
  return (
    <VStack align="start" p="1em" spacing="3em" layerStyle="cardBox">
      <Button
        as={ReactRouterLink}
        to={ROUTES.CREDENTIALS.REQUEST.path}
        variant="empty"
        color="brand.500"
        rightIcon={<FaPlus fontSize="1rem" />}
        iconSpacing="1em"
        mx="auto"
      >
        Request credential
      </Button>
      {sections.map((section, index) => {
        return (
          <CredentialSection
            key={`credential-section-${index}`}
            section={section.section}
            credentials={section.credentials}
            tree={section.tree}
          />
        );
      })}
    </VStack>
  );
};
