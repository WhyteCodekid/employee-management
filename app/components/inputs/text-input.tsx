/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, InputProps } from "@nextui-org/react";

export default function TextInput({ ...props }: InputProps) {
  return (
    <Input
      color="success"
      labelPlacement="outside"
      placeholder=" "
      variant="bordered"
      classNames={{
        label: "font-montserrat font-semibold text-slate-700 dark:text-white",
        base: "shadow-none font-quicksand",
      }}
      {...props}
    />
  );
}
