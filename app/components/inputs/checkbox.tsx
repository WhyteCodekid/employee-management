import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function CustomCheckbox({
  name,
  children,
  defaultSelected = false,
}: {
  name: string;
  children: string;
  defaultSelected?: boolean;
}) {
  const [isSelected, setIsSelected] = useState(defaultSelected);

  return (
    <>
      <input type="hidden" name={name} value={isSelected ? "true" : "false"} />
      <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
        {children}
      </Checkbox>
    </>
  );
}
