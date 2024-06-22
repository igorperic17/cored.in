import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack
} from "@chakra-ui/react";
import { CredentialDTO, CredentialType } from "@coredin/shared";
import { useState } from "react";
import { credentialLabels } from "../constants/credentialLabels";
import { handleMonthChange, handleYearChange } from "../helpers/dates";
import { months } from "../constants/months";

const defaultDate = "01-00-0000";
const getSelectedMonth = (month: string) => {
  const monthIndex = months.indexOf(month);
  return monthIndex + 1 > 9 ? `${monthIndex + 1}` : `0${monthIndex + 1}`;
};

export const RequestCredential = () => {
  const [state, setState] = useState<Partial<CredentialDTO>>({});

  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear; i > currentYear - 70; i--) {
    years.push(i);
  }

  console.log("start: ", state.startDate);
  console.log("end: ", state.endDate);

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
          isRequired
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
              isRequired
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
              isRequired
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
                isRequired
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
                isRequired
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

          {/* !!!!!! HANDLE THE CASE WHEN THE USER INTRODUCES AN END DATE THAT WAS BEFORE THE START DATE */}
          <FormControl>
            <FormLabel>End date</FormLabel>
            <Flex direction="row" gap="1em">
              <Select
                // isRequired
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
                // isRequired
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
          </FormControl>

          {/* LAST */}
          <FormControl>
            <FormLabel>Select an issuer</FormLabel>
            <Select
              isRequired
              border="1px solid #828178"
              focusBorderColor="brand.500"
              value={state.issuer}
              onChange={(e) => setState({ ...state, issuer: e.target.value })}
            >
              {/* double check the values */}
              {/* should we have an empty option or use one of the three options as a default? */}
              {/* !!! TODO !!! */}
              <option></option>
              <option>Issuer name 1</option>
              <option>Issuer name 2</option>
              <option>Issuer name 3</option>
              <option>Issuer name 4</option>
              <option>Issuer name 5</option>
            </Select>
          </FormControl>

          <Button variant="primary" size="md" w="100%">
            Send a request
          </Button>
        </>
      )}
    </VStack>
  );
};