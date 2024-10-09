import { formElementBorderStyles } from "@/themes";
import { SkillTag } from "@coredin/shared";
import { chakraComponents, Select } from "chakra-react-select";
import { FC } from "react";
import { FaPlus } from "react-icons/fa6";

type MultiSelectProps = {
  options: SkillTag[];
  value: SkillTag[];
  onChange: (value: any) => void;
  placeholder: string;
  menuPlacement?: "top" | "bottom" | "auto";
};

export const MultiSelect: FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  menuPlacement = "top",
  ...props
}) => {
  return (
    <Select
      focusBorderColor="brand.200"
      menuPlacement={menuPlacement}
      options={options.map((option) => ({ label: option, value: option }))}
      value={value.map((tag) => ({ label: tag, value: tag }))}
      isMulti={true}
      onChange={onChange}
      isClearable={false}
      isSearchable={true}
      placeholder={placeholder}
      chakraStyles={{
        dropdownIndicator: (provided, state) => ({
          ...provided,
          color: state.selectProps.menuIsOpen ? "brand.900" : "brand.100",
          backgroundColor: state.selectProps.menuIsOpen
            ? "brand.200"
            : "brand.500",
          _hover: {
            backgroundColor: "brand.200",
            color: "brand.900"
          },
          cursor: "pointer",
          transitionDuration: "normal",
          "> svg": {
            transitionDuration: "normal",
            transform: `rotate(${state.selectProps.menuIsOpen ? -45 : 0}deg)`
          }
        }),
        control: (provided) => ({
          ...provided,
          ...formElementBorderStyles,
          fontSize: { base: "1rem", md: "1.25rem" },
          borderRadius: "1.125em"
        }),
        multiValue: (provided) => ({
          ...provided,
          bg: "brand.200",
          color: "brand.900",
          borderRadius: "2em",
          px: "1em",
          py: "0.25em",
          mr: "0"
        }),
        multiValueRemove: (provided) => ({
          ...provided,
          fontSize: "1.125rem",
          color: "brand.900"
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          px: "0"
        }),
        placeholder: (provided) => ({
          ...provided,
          fontSize: { base: "0.875rem", lg: "1rem" },
          color: "text.700",
          ml: "0.75em"
        }),
        valueContainer: (provided) => ({
          ...provided,
          px: "0.25em",
          py: "0.25em",
          gap: "0.125em"
        })
      }}
      components={{
        DropdownIndicator: (props) => (
          <chakraComponents.DropdownIndicator {...props}>
            <FaPlus />
          </chakraComponents.DropdownIndicator>
        )
      }}
      {...props}
    />
  );
};
