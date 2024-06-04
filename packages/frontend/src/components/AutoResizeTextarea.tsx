import { Textarea, TextareaProps } from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";
import React from "react";

export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>((props, ref) => {
  return (
    <Textarea
      as={ResizeTextarea}
      minH="60px"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref}
      minRows={1}
      _placeholder={{
        color: "text.400"
      }}
      _focus={{
        borderColor: "brand.500"
      }}
      {...props}
    />
  );
});
