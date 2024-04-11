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
        color={isVisible ? "colors.text.100" : "colors.text.600"}
        _hover={{
          color: "colors.text.100"
        }}
        onClick={onClick}
        cursor="pointer"
      >
        {title}
      </Heading>
      <Collapse in={isVisible} animateOpacity>
        <Box
          p="40px"
          color="colors.text.800"
          mt="4"
          bg="colors.brand.600"
          rounded="md"
          shadow="md"
        >
          {description}
        </Box>
      </Collapse>
    </ListItem>
  );
};
