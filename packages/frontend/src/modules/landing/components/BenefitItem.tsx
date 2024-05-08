import { appearFromRightOneByOne } from "@/components/constants/animations";
import { Box, Collapse, Heading, ListItem, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC } from "react";

interface BenefitItemProps {
  title: string;
  description: string;
  isVisible: boolean;
  onClick: () => void;
  index: number;
}

export const BenefitItem: FC<BenefitItemProps> = ({
  title,
  description,
  isVisible,
  onClick,
  index
}) => {
  return (
    <ListItem
      as={motion.li}
      variants={appearFromRightOneByOne}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0 }}
      custom={index}
    >
      <Heading
        as="h3"
        fontSize={{ base: "1.75rem", md: "3.5rem", lg: "4rem" }}
        color={isVisible ? "text.100" : "text.400"}
        _hover={{
          color: "text.100"
        }}
        onClick={onClick}
        cursor="pointer"
      >
        {title}
      </Heading>
      <Collapse in={isVisible} animateOpacity>
        <Box p="40px" mt="4" bg="brand.500" rounded="md" shadow="md">
          <Text color="text.900" maxW="700px">
            {description}
          </Text>
        </Box>
      </Collapse>
    </ListItem>
  );
};
