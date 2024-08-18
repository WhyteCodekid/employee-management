/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, InputProps } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function TextInput({
  actionData,
  ...props
}: InputProps & { actionData?: any }) {
  const [inputActionData, setInputActionData] = useState<typeof actionData>();

  useEffect(() => {
    if (actionData) {
      setInputActionData(actionData);
    }
  }, [actionData]);
  return (
    <Input
      color="primary"
      labelPlacement="outside"
      placeholder=" "
      variant="bordered"
      classNames={{
        label: "font-sen font-semibold text-slate-700 dark:text-white",
        base: "shadow-none font-nunito",
      }}
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
      onChange={() => setInputActionData(undefined)}
      {...props}
    />
  );
}
