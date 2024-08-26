import { Select, SelectProps } from "@nextui-org/react";
import { useState, useEffect } from "react";

const CustomSelect = ({
  actionData,
  children,
  ...props
}: SelectProps & { actionData?: any; children: any }) => {
  const [inputActionData, setInputActionData] = useState<typeof actionData>();

  useEffect(() => {
    if (actionData) {
      setInputActionData(actionData.errors);
    }
  }, [actionData]);

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
      isInvalid={
        inputActionData?.errors &&
        inputActionData?.errors.find((input: any) => input.field === props.name)
          ? true
          : false
      }
      errorMessage={
        inputActionData?.errors &&
        inputActionData?.errors.find((input: any) => input.field === props.name)
          ?.message
      }
      {...props}
      onChange={() => setInputActionData(undefined)}
    >
      {children}
    </Select>
  );
};

export default CustomSelect;
