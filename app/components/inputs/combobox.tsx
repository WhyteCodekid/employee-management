import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Avatar,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "~/data/api/departments";
import { API_BASE_URL } from "~/data/dotenv";
import { DepartmentInterface, UserInterface } from "~/utils/types";

export const DepartmentsCombobox = ({
  token,
  actionData,
  value,
  setValue,
  ...props
}: AutocompleteProps & {
  token: string;
  actionData?: any;
  value: string;
  setValue: (key: string) => void;
}) => {
  const [inputActionData, setInputActionData] = useState<typeof actionData>();

  useEffect(() => {
    if (actionData) {
      setInputActionData(actionData);
    }
  }, [actionData]);

  //   combobox items
  const [filterText, setFilterText] = useState("");
  const comboboxSWR = useSWR(
    `${API_BASE_URL}/api/departments?search_term=${filterText}`,
    fetcher(token),
    {
      keepPreviousData: true,
    }
  );
  console.log(comboboxSWR.data);

  return (
    <>
      <Autocomplete
        color="primary"
        labelPlacement="outside"
        placeholder=" "
        variant="bordered"
        inputProps={{
          classNames: {
            label: "font-sen font-semibold text-slate-700 dark:text-white",
            base: "shadow-none font-nunito",
          },
        }}
        popoverProps={{
          classNames: {
            content: "dark:bg-slate-900",
          },
        }}
        isInvalid={
          inputActionData?.errors &&
          inputActionData?.errors.find(
            (input: any) => input.field === "department"
          )
            ? true
            : false
        }
        errorMessage={
          inputActionData?.errors &&
          inputActionData?.errors.find(
            (input: any) => input.field === "department"
          )?.message
        }
        isLoading={comboboxSWR.isLoading}
        onValueChange={setFilterText}
        onSelectionChange={(key: string) => {
          setValue(key);
        }}
        selectedKey={value}
        {...props}
      >
        {comboboxSWR.data &&
          comboboxSWR.data.departments.map((item: DepartmentInterface) => (
            <AutocompleteItem key={item._id} textValue={item.name}>
              <p className="font-nunito">{item.name}</p>
            </AutocompleteItem>
          ))}
      </Autocomplete>
    </>
  );
};

export const SupportUsersCombobox = ({
  token,
  actionData,
  value,
  setValue,
  ...props
}: AutocompleteProps & {
  token: string;
  actionData?: any;
  value: string;
  setValue: (key: string) => void;
}) => {
  const [inputActionData, setInputActionData] = useState<typeof actionData>();

  useEffect(() => {
    if (actionData) {
      setInputActionData(actionData);
    }
  }, [actionData]);

  //   combobox items
  const [filterText, setFilterText] = useState("");
  const comboboxSWR = useSWR(
    `${API_BASE_URL}/api/users?search_term=${filterText}&role=support`,
    fetcher(token),
    {
      keepPreviousData: true,
    }
  );
  console.log(comboboxSWR.data);

  return (
    <>
      <Autocomplete
        color="primary"
        labelPlacement="outside"
        placeholder=" "
        variant="bordered"
        inputProps={{
          classNames: {
            label: "font-sen font-semibold text-slate-700 dark:text-white",
            base: "shadow-none font-nunito",
          },
        }}
        popoverProps={{
          classNames: {
            content: "dark:bg-slate-900",
          },
        }}
        isInvalid={
          inputActionData?.errors &&
          inputActionData?.errors.find(
            (input: any) => input.field === "assignee"
          )
            ? true
            : false
        }
        errorMessage={
          inputActionData?.errors &&
          inputActionData?.errors.find(
            (input: any) => input.field === "assignee"
          )?.message
        }
        isLoading={comboboxSWR.isLoading}
        onValueChange={setFilterText}
        onSelectionChange={(key: string) => {
          setValue(key);
        }}
        selectedKey={value}
        {...props}
      >
        {comboboxSWR.data &&
          comboboxSWR.data?.data?.users?.map((item: UserInterface) => (
            <AutocompleteItem
              key={item._id}
              textValue={item.firstName + " " + item.lastName}
            >
              <p className="font-nunito">
                {item.firstName + " " + item.lastName}
              </p>
            </AutocompleteItem>
          ))}
      </Autocomplete>
    </>
  );
};
