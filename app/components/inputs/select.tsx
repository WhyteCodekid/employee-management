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
      className="font-nunito text-lg"
      classNames={{
        label:
          "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
        popoverContent: "bg-white dark:bg-slate-900 font-nunito",
      }}
      variant="bordered"
      color="primary"
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
