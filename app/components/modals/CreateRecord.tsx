import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Form, useNavigation, useSubmit } from "@remix-run/react";

const CreateRecordModal = ({
  isOpen,
  onOpenChange,
  onCloseModal,
  title,
  actionText,
  children,
  size,
  intent,
  ...rest
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCloseModal: () => void;
  title: string;
  actionText: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  intent: string;
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
          intent,
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
      size={size}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onCloseModal}
      backdrop="opaque"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-3xl dark:bg-slate-900 border-[1px] dark:border-slate-700/20",
      }}
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
            <ModalHeader className="flex flex-col gap-1 font-montserrat font-semibold text-lg text-slate-800 dark:text-white">
              {title}
            </ModalHeader>
            <ModalBody>
              <Form
                {...rest}
                method={"POST"}
                id="create-record-form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {children}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onCloseModal}
                className="font-montserrat font-semibold"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={navigation.state === "submitting"}
                type="submit"
                form="create-record-form"
                className="font-montserrat font-medium"
              >
                {actionText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateRecordModal;
