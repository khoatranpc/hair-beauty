import { TypeOfCategory } from "@/types/enum";
import { getTypeOfCategoryString } from "@/utils";
import { Radio } from "antd";
import { RadioGroupProps } from "antd/es/radio";
import React from "react";

interface Props extends RadioGroupProps {
  key?: string;
}
const SelectTypeOfCategory = (props: Props) => {
  return (
    <Radio.Group {...props}>
      {Object.entries(TypeOfCategory).map(([key, value]) => (
        <Radio key={key} value={value}>
          {getTypeOfCategoryString[value]}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default SelectTypeOfCategory;
