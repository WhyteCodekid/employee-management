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

const EditRecordModal = ({
  isModalOpen,
  onCloseModal,
  title,
  children,
  size = "md",
  intent,
}: {
  isModalOpen: boolean;
  onCloseModal: () => void;
  title: string;
  children: React.ReactNode;
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
      backdrop={"opaque"}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      className="dark:bg-slate-900 border-[1px] dark:border-slate-700/20 w-full md:w-1/2"
      size={size}
      scrollBehavior="inside"
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
            <ModalHeader className="flex flex-col gap-1 font-montserrat">
              {title}
            </ModalHeader>
            <ModalBody>
              <Form
                method={"POST"}
                id="form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {children}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                className="font-montserrat"
                color="danger"
                variant="flat"
                onPress={onCloseModal}
              >
                Cancel
              </Button>
              <Button
                isLoading={navigation.state === "submitting"}
                className="font-montserrat"
                color="primary"
                type="submit"
                form="form"
              >
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditRecordModal;
