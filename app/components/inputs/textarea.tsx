import { TextAreaProps, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function TextareaInput({
  actionData,
  ...props
}: TextAreaProps & { actionData?: any }) {
  const [inputActionData, setInputActionData] = useState<typeof actionData>();

  useEffect(() => {
    if (actionData) {
      setInputActionData(actionData);
    }
  }, [actionData]);
  return (
    <Textarea
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
