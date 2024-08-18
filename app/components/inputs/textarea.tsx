import { TextAreaProps, Textarea } from "@nextui-org/react";

export default function TextareaInput({ ...props }: TextAreaProps) {
  return (
    <Textarea
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
