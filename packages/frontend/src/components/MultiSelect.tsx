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
  onChange
}) => {
  return (
    <Select
      {...formElementBorderStyles}
      menuPlacement="auto"
      options={options.map((option) => ({ label: option, value: option }))}
      value={value.map((tag) => ({ label: tag, value: tag }))}
      isMulti={true}
      onChange={onChange}
      // chakraStyles={{
      //   menuList: (provided) => ({
      //     ...provided,
      //     minHeight: "350px"
      //   })
      // }}
    />
  );
};
