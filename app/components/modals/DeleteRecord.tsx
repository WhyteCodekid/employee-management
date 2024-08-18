/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import axios from "axios";
import { useSWRConfig } from "swr";
import { useState } from "react";
import { errorToast, successToast } from "~/utils/toasters";

const DeleteRecordModal = ({
  isModalOpen,
  onCloseModal,
  title,
  children,
  size = "md",
  ...rest
}: {
  isModalOpen: boolean;
  onCloseModal: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  // state to handle loading
  const submit = useSubmit();
  const navigation = useNavigation();

  // function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formValues: { [key: string]: string } = {};

      for (const [key, value] of formData.entries()) {
        formValues[key] = value as string;
      }

      submit(
        {
          ...formValues,
          intent: "delete",
        },
        {
          method: "POST",
          replace: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      backdrop={"opaque"}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      className="dark:bg-slate-900 border-[1px] dark:border-slate-700/20 w-full md:w-1/2"
      size={size}
      motionProps={{
        variants: {
          enter: {
            scale: [1, 0.9],
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            scale: [0.9, 1],
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-montserrat text-red-500 font-bold">
              {title}
            </ModalHeader>
            <ModalBody>
              <Form
                method={"POST"}
                id="form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                {...rest}
              >
                {children}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                className="font-montserrat font-medium"
                color="default"
                variant="flat"
                onPress={onCloseModal}
              >
                Cancel
              </Button>
              <Button
                isLoading={navigation.state === "submitting"}
                className="font-montserrat font-medium"
                color="danger"
                type="submit"
                form="form"
              >
                Confirm Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteRecordModal;
