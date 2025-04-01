import { TypeOfCategory } from "@/types/enum";
import { getTypeOfCategoryString } from "@/utils";
import { Checkbox } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import React from "react";

interface Props extends CheckboxGroupProps {}
const SelectTypeOfCategory = (props: Props) => {
  return (
    <Checkbox.Group {...props}>
      {Object.entries(TypeOfCategory).map(([key, value]) => {
        return (
          <Checkbox key={key} value={value}>
            {getTypeOfCategoryString[value]}
          </Checkbox>
        );
      })}
    </Checkbox.Group>
  );
};

export default SelectTypeOfCategory;
