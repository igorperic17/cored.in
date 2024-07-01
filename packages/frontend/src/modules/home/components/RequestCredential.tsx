import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  VStack,
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
                  Please enter valid end date
                </Text>
              )}
            </FormControl>
          )}

          {/* LAST */}
          <FormControl>
            <FormLabel>Select an issuer</FormLabel>
            <Select
              border="1px solid #828178"
              focusBorderColor="brand.500"
              value={state.issuer}
              onChange={(e) => {
                setState({ ...state, issuer: e.target.value });
              }}
            >
              {/* double check the values */}
              {/* !!! TODO !!! */}
              <option value="">Select an issuer</option>
              {issuers?.map((issuer) => (
                <option key={issuer.issuerDid} value={issuer.issuerDid}>
                  {issuer.username}
                </option>
              ))}
            </Select>
            {/* <Menu isLazy>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Your Cats
              </MenuButton>
              <MenuList>
                <MenuItem minH="48px">
                  {/* <Image
                    boxSize="2rem"
                    borderRadius="full"
                    src="https://placekitten.com/100/100"
                    alt="Fluffybuns the destroyer"
                    mr="12px"
                  /> */}
            {/* <span>Fluffybuns the Destroyer</span>
                </MenuItem>
                <MenuItem minH="40px"> */}
            {/* <Image
                    boxSize="2rem"
                    borderRadius="full"
                    src="https://placekitten.com/120/120"
                    alt="Simon the pensive"
                    mr="12px"
                  /> */}
            {/* <span>Simon the pensive</span>
                </MenuItem>
              </MenuList>
            </Menu> */}
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
