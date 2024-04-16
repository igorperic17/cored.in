import { Box, Collapse, Heading, ListItem } from "@chakra-ui/react";
import { FC } from "react";

interface BenefitItemProps {
  title: string;
  description: string;
  isVisible: boolean;
  onClick: () => void;
}

export const BenefitItem: FC<BenefitItemProps> = ({
  title,
  description,
  isVisible,
  onClick
}) => {
  return (
    <ListItem>
      <Heading
        as="h3"
        fontSize="3rem"
        color={isVisible ? "text.100" : "text.600"}
        _hover={{
          color: "text.100"
        }}
        onClick={onClick}
        cursor="pointer"
      >
        {title}
      </Heading>
      <Collapse in={isVisible} animateOpacity>
        <Box
          p="40px"
          color="text.800"
          mt="4"
          bg="brand.600"
          rounded="md"
          shadow="md"
        >
          {description}
        </Box>
      </Collapse>
    </ListItem>
  );
};
