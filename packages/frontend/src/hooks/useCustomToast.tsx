import { Box, useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
  const toast = useToast();

  const successToast = (message: string) => {
    toast({
      status: "success",
      duration: 1500,
      position: "bottom",
      isClosable: true,
      render: () => (
        <Box
          mx="auto"
          color="brand.100"
          py="0.5em"
          bg="brand.300"
          borderRadius="0.5em"
          textAlign="center"
          fontSize="1.125rem"
        >
          {message}
        </Box>
      )
    });
  };

  const errorToast = (message: string) => {
    toast({
      status: "error",
      duration: 1500,
      position: "bottom",
      isClosable: true,
      render: () => (
        <Box
          mx="auto"
          color="brand.100"
          p="1em 1.5em"
          bg="brand.400"
          borderRadius="2em"
          textAlign="center"
          fontSize="1.125rem"
        >
          {message}
        </Box>
      )
    });
  };

  return { successToast, errorToast };
};
