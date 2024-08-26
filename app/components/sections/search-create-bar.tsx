import { Button, Input, useDisclosure } from "@nextui-org/react";
import CreateRecordModal from "../modals/CreateRecord";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export default function SearchAndCreateRecordBar({
  buttonText = "New Record",
  children,
  modalTitle = "Create New Record",
  formIntent = "create",
  searchValue,
  pageValue,
  flashMessage,
}: {
  buttonText?: string;
  children: ReactNode;
  modalTitle?: string;
  formIntent?: string;
  searchValue?: string;
  pageValue?: number;
  flashMessage: { message: string; status: "error" | "success" };
}) {
  const createRecordDisclosure = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    if (flashMessage && flashMessage.status === "success") {
      createRecordDisclosure.onClose();
    }
  }, [flashMessage]);

  return (
    <div className="flex items-center justify-between py-4 px-4">
      <Input
        value={searchValue}
        onValueChange={(value) =>
          navigate(`?search_term=${value || ""}&page=${pageValue || ""}`)
        }
        variant="bordered"
        placeholder="Search here..."
        className="w-1/4"
        classNames={{
          inputWrapper: "bg-white dark:bg-transparent",
        }}
        color="success"
        aria-labelledby="search input"
      />

      <Button
        color="success"
        onPress={() => createRecordDisclosure.onOpen()}
        className="font-montserrat text-white font-semibold"
      >
        {buttonText}
      </Button>

      <CreateRecordModal
        isOpen={createRecordDisclosure.isOpen}
        onCloseModal={createRecordDisclosure.onClose}
        onOpenChange={createRecordDisclosure.onOpenChange}
        title={modalTitle}
        actionText="Submit"
        size="lg"
        intent={formIntent}
      >
        {children}
      </CreateRecordModal>
    </div>
  );
}
