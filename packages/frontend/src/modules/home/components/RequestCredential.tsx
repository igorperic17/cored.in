import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import {
  CredentialDTO,
  CredentialRequestStatus,
  CredentialType
} from "@coredin/shared";
import { useState } from "react";
import { credentialLabels } from "../constants/credentialLabels";
import { handleMonthChange, handleYearChange } from "../helpers/dates";
import { months } from "../constants/months";
import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { ISSUER_QUERIES } from "@/queries/IssuerQueries";
import { ISSUER_MUTATIONS } from "@/queries/IssuerMutations";
import { defaultDate, defaultState } from "./credentials/constants";
import {
  getSelectedMonth,
  hasInvalidInput,
  isEndDateAfterStart
} from "./credentials/helpers";
import { years } from "../constants/years";

export const RequestCredential = () => {
  const { data: issuers } = useLoggedInServerState(ISSUER_QUERIES.getIssuers());
  // console.log(CredentialRequestStatus);
  const { mutateAsync } = useMutableServerState(
    ISSUER_MUTATIONS.requestCredential()
  );
  const [state, setState] = useState<CredentialDTO>({ ...defaultState });
  const [hasEndDate, setHasEndDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEndDateCheckbox = () => {
    setHasEndDate((prevHasEndDate) => !prevHasEndDate);
    setState((prevState) => ({ ...prevState, endDate: undefined }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    mutateAsync({ request: state, issuerDid: state.issuer })
      .then((response) => {
        // console.log(response);
        if (response) {
          toast({
            position: "top-right",
            status: "success",
            duration: 1000,
            render: () => (
              <Box
                color="text.900"
                p="1em 1.5em"
                bg="brand.500"
                borderRadius="0.5em"
              >
                Credential submitted successfully
              </Box>
            )
          });
        }
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error(error);
        setIsSubmitting(false);
      });

    setState({ ...defaultState });
  };

  return (
    <VStack
      spacing="2.5em"
      layerStyle="cardBox"
      p="1em"
      pb="1.5em"
      align="start"
      mb="4em"
    >
      <Heading as="h1" fontFamily="body">
        Request new credential
      </Heading>

      <FormControl>
        <FormLabel>Select the type of a credential</FormLabel>
        <Select
          border="1px solid #828178"
          focusBorderColor="brand.500"
          value={state.type}
          onChange={(e) =>
            setState({
              ...state,
              type: (e.target.value as CredentialType) || ""
            })
          }
        >
          <option value="">Select a type</option>
          <option value="EducationCredential">Education</option>
          <option value="ProfessionalExperience">
            Professional experience
          </option>
          <option value="EventAttendance">Event attendance</option>
        </Select>
      </FormControl>

      {state.type && (
        <>
          <FormControl>
            <FormLabel>{credentialLabels[state.type].titleLabel}</FormLabel>
            <Input
              type="text"
              border="1px solid #828178"
              focusBorderColor="brand.500"
              placeholder={credentialLabels[state.type].titlePlaceholder}
              value={state.title}
              onChange={(e) => setState({ ...state, title: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              {credentialLabels[state.type].establishmentLabel}
            </FormLabel>
            <Input
              type="text"
              border="1px solid #828178"
              focusBorderColor="brand.500"
              placeholder={
                credentialLabels[state.type].establishmentPlaceholder
              }
              value={state.establishment}
              onChange={(e) =>
                setState({ ...state, establishment: e.target.value })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Start date</FormLabel>
            <Flex direction="row" gap="1em">
              <Select
                border="1px solid #828178"
                focusBorderColor="brand.500"
                onChange={(e) =>
                  setState({
                    ...state,
                    startDate: handleMonthChange(
                      getSelectedMonth(e.target.value),
                      state.startDate || defaultDate
                    )
                  })
                }
              >
                <option value="0">Month</option>
                {months.map((month, index) => {
                  return (
                    <option key={`start-date-month-${index}`} value={month}>
                      {month}
                    </option>
                  );
                })}
              </Select>

              <Select
                border="1px solid #828178"
                focusBorderColor="brand.500"
                onChange={(e) =>
                  setState({
                    ...state,
                    startDate: handleYearChange(
                      e.target.value,
                      state.startDate || defaultDate
                    )
                  })
                }
              >
                <option value="0000">Year</option>
                {years.map((year, index) => {
                  return (
                    <option key={`start-date-year-${index}`} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Select>
            </Flex>
          </FormControl>

          <Checkbox isChecked={!hasEndDate} onChange={handleEndDateCheckbox}>
            {credentialLabels[state.type].hasEndDateLabel}
          </Checkbox>
          {hasEndDate && (
            <FormControl>
              <FormLabel>End date</FormLabel>
              <Flex direction="row" gap="1em">
                <Select
                  border="1px solid #828178"
                  focusBorderColor="brand.500"
                  onChange={(e) =>
                    setState({
                      ...state,
                      endDate: handleMonthChange(
                        getSelectedMonth(e.target.value),
                        state.endDate || defaultDate
                      )
                    })
                  }
                >
                  <option value="0">Month</option>
                  {months.map((month, index) => {
                    return (
                      <option key={`end-date-month-${index}`} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </Select>

                <Select
                  border="1px solid #828178"
                  focusBorderColor="brand.500"
                  onChange={(e) =>
                    setState({
                      ...state,
                      endDate: handleYearChange(
                        e.target.value,
                        state.endDate || defaultDate
                      )
                    })
                  }
                >
                  <option value="0000">Year</option>
                  {years.map((year, index) => {
                    return (
                      <option key={`end-date-year-${index}`} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </Select>
              </Flex>
              {!isEndDateAfterStart(state.startDate, state.endDate) && (
                <Text mt="0.5em" color="brand.500" textStyle="sm">
                  Please enter a valid end date
                </Text>
              )}
            </FormControl>
          )}

          {/* LAST */}
          <FormControl>
            {/* todo: label */}
            <FormLabel>Select an issuer</FormLabel>
            <Button
              id="issuer"
              w="100%"
              wordBreak="break-word"
              role="combobox"
              aria-controls="issuers-listbox"
              aria-haspopup="listbox"
              aria-label="Select an issuer."
              tabIndex={0}
              aria-expanded="false"
              bg="transparent"
              borderRadius="0.375rem"
              color="text.100"
              textTransform="none"
              fontWeight="normal"
              fontSize={{ base: "0.875rem", lg: "1rem" }}
              border="1px solid #828178"
              _hover={{
                bg: "transparent",
                color: "inherit",
                border: "1px solid",
                borercolor: "background.100"
              }}
              onClick={onOpen}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              <Text
                as="span"
                mr="auto"
                ml="-0.625em"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {state.issuer || "Select an issuer"}
              </Text>
            </Button>

            <Modal onClose={onClose} isOpen={isOpen}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>List of available issuers</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack
                    as="ul"
                    display="block"
                    role="listbox"
                    id="issuers-listbox"
                    // border="1px solid red"
                    // w="100%"
                    // w="80%"
                    listStyleType="none"
                    align="start"
                    // textOverflow="ellipsis"
                    // py="0em"
                    // px="1em"
                    // bg="background.900"
                    borderRadius="1em"
                  >
                    {issuers?.map((issuer) => (
                      <Flex
                        as="li"
                        role="option"
                        key={`issuer-${issuer.issuerDid}`}
                        value={issuer.issuerDid}
                        // outline="1px solid yellow"
                        direction="row"
                        gap="0.5em"
                        align="center"
                        py="1em"
                        px="1em"
                        borderLeft="1px solid"
                        borderLeftColor="transparent"
                        borderBottom="2px solid #3E3D3A"
                        _last={{ borderBottom: "none" }}
                        cursor="pointer"
                        _hover={{
                          color: "brand.500",

                          borderLeftColor: "brand.500"
                        }}
                        onClick={() => {
                          onClose();
                          setState({ ...state, issuer: issuer.issuerDid! }); // is this ok?
                        }}
                      >
                        <Avatar
                          name={issuer.username}
                          src={issuer.avatarUrl}
                          bg="background.600"
                          color={issuer.avatarFallbackColor || "brand.500"}
                          size={{ base: "sm", sm: "md", lg: "md" }}
                        />
                        <VStack
                          align="start"
                          // overflow="hidden"
                          // border="1px solid white"
                          // w="100%"
                          spacing="0em"
                        >
                          <Text as="span">{issuer.username}</Text>
                          <Box
                            color="text.400"
                            textOverflow="ellipsis"
                            display="inline"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            // w="calc(80%)"

                            maxW="300px"
                            // border="1px solid red"
                          >
                            <Text
                              as="span"
                              display="inline"
                              // textOverflow="ellipsis"
                              // display="inline-block"
                              // whiteSpace="nowrap"
                              // overflow="hidden"
                              //
                            >
                              {issuer.issuerDid}
                            </Text>
                          </Box>
                        </VStack>
                      </Flex>
                    ))}
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </FormControl>

          <Button
            variant="primary"
            size="md"
            w="100%"
            onClick={handleSubmit}
            isDisabled={hasInvalidInput(state, hasEndDate)}
            isLoading={isSubmitting}
          >
            Send a request
          </Button>
        </>
      )}
    </VStack>
  );
};
