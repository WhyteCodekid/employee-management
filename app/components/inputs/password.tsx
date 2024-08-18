import { Input, InputProps } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { EyeFilled, EyeSlashFilled } from "../icons/eye";
import { ActionDataInterface } from "~/utils/types";

export default function PasswordInput({
  actionData,
  ...props
}: InputProps & { actionData?: any }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashFilled className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilled className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
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
