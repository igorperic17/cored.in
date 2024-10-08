import { formElementBorderStyles } from "@/themes";
import { SkillTag } from "@coredin/shared";
import { Select } from "chakra-react-select";
import { FC } from "react";

type MultiSelectProps = {
  options: SkillTag[];
  value: SkillTag[];
  onChange: (value: any) => void;
};

export const MultiSelect: FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  ...props
}) => {
  return (
    <Select
      focusBorderColor="brand.200"
      menuPlacement="top"
      options={options.map((option) => ({ label: option, value: option }))}
      value={value.map((tag) => ({ label: tag, value: tag }))}
      isMulti={true}
      onChange={onChange}
      isClearable={false}
      isSearchable={true}
      chakraStyles={{
        dropdownIndicator: (provided, state) => ({
          ...provided,
          color: "brand.100",
          backgroundColor: "brand.500",
          cursor: "pointer",
          "> svg": {
            transitionDuration: "normal",
            transform: `rotate(${state.selectProps.menuIsOpen ? -180 : 0}deg)`
          }
        }),
        control: (provided) => ({
          ...provided,
          ...formElementBorderStyles,
          fontSize: { base: "1em", md: "1.25em" }
        }),
        multiValue: (provided) => ({
          ...provided,
          bg: "brand.200",
          color: "brand.900",
          borderRadius: "2em",
          px: "1em",
          py: "0.25em"
          // backgroundColor: "brand.500"
        }),
        multiValueRemove: (provided) => ({
          ...provided,
          fontSize: "1.125em",
          color: "brand.900"
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          px: "0"
        })

        // menuList: (provided) => ({
        //   ...provided,
        //   minHeight: "350px"
        // })
      }}
      {...props}
    />
  );
};
