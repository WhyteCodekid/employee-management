import { Select, SelectProps } from "@nextui-org/react";
import { useState, useEffect } from "react";

const CustomSelect = ({
  children,
  ...props
}: SelectProps & { actionData?: any; children: any }) => {
  return (
    <Select
      className="font-nunito"
      classNames={{
        label: "font-medium font-montserrat text-slate-800 dark:text-slate-100",
        popoverContent: "bg-white font-nunito dark:bg-content2",
      }}
      variant="bordered"
      color="success"
      labelPlacement="outside"
      placeholder=" "
      {...props}
      // onChange={() => setInputActionData(undefined)}
    >
      {children}
    </Select>
  );
};

export default CustomSelect;
