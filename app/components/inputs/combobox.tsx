import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Avatar,
} from "@nextui-org/react";
import axios from "axios";
import { Key, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { UserInterface } from "~/utils/types";

export const UsersCombobox = () => {
  const [value, setValue] = useState<any>(null);

  //   combobox items
  const [filterText, setFilterText] = useState("");
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url);
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log(error);
      toast.error("Error fetching users. " + error.message);
    }
  };
  const comboboxSWR = useSWR(`/api/users?search_term=${filterText}`, fetcher, {
    keepPreviousData: true,
  });

  return (
    <>
      <Autocomplete
        color="primary"
        labelPlacement="outside"
        label="Select Employee"
        placeholder=" "
        name="user"
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
        isLoading={comboboxSWR.isLoading}
        onValueChange={setFilterText}
        onSelectionChange={(key: Key | null) => {
          setValue(key);
        }}
        selectedKey={value}
      >
        {comboboxSWR.data &&
          comboboxSWR.data?.users?.map((item: UserInterface) => (
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
