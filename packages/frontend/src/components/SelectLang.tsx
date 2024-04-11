import { LANGUAGES } from "@/constants";
import { Button, HStack, Img } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SpainFlag from "../assets/SpainFlag.svg";
import UkFlag from "../assets/UkFlag.svg";

export const SelectLang = () => {
  const { i18n } = useTranslation();

  return (
    <>
      <HStack gap="1em">
        <Img
          src={UkFlag}
          w="32px"
          h="24px"
          alt="English"
          borderRadius="3"
          onClick={() => i18n.changeLanguage("en")}
          cursor="pointer"
          objectFit="cover"
          opacity={i18n.language.includes("en") ? "100%" : "30%"}
          _hover={{ opacity: "100%" }}
        />
        <Img
          src={SpainFlag}
          w="32px"
          h="24px"
          alt="Spanish"
          borderRadius="3"
          onClick={() => i18n.changeLanguage("es")}
          cursor="pointer"
          objectFit="cover"
          opacity={i18n.language.includes("es") ? "100%" : "30%"}
          _hover={{ opacity: "100%" }}
        />
      </HStack>
      {/* {i18n.language === "en" && (
        <Img
          src={SpainFlag}
          w="32px"
          h="24px"
          alt="Spanish"
          borderRadius="3"
          onClick={() => i18n.changeLanguage("es")}
          cursor="pointer"
          objectFit="cover"
        />
      )}
      {i18n.language === "es" && (
        <Img
          src={UkFlag}
          w="32px"
          h="24px"
          alt="English"
          borderRadius="3"
          onClick={() => i18n.changeLanguage("en")}
          cursor="pointer"
          objectFit="cover"
        />
      )} */}
    </>
  );
};

// Legacy generic select

// export const SelectLang = () => {
//   const { i18n, t } = useTranslation();
//   const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const lang_code = e.target.value;
//     i18n.changeLanguage(lang_code);
//   };

//   return (
//     <Select
//       defaultValue={i18n.language}
//       onChange={onChangeLang}
//       w={24}
//       size="sm"
//       mr="8"
//       borderRadius="8px"
//     >
//       {LANGUAGES.map(({ code, label }) => (
//         <option key={code} value={code}>
//           {label}
//         </option>
//       ))}
//     </Select>
//   );
// };
