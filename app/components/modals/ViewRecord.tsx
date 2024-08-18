import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const ViewRecordModal = ({
  isOpen,
  onOpenChange,
  onCloseModal,
  title,
  children,
  size,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCloseModal: () => void;
  title: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onCloseModal}
      backdrop="opaque"
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
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="flat"
                onPress={onCloseModal}
                className="font-montserrat font-semibold dark:bg-slate-700"
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewRecordModal;
