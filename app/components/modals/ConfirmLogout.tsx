import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

const ConfirmLogoutModal = ({
  isModalOpen,
  onCloseModal,
}: {
  isModalOpen: boolean;
  onCloseModal: () => void;
}) => {
  // state to handle loading
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <Modal
      backdrop={"opaque"}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      className="dark:bg-slate-900 border-[1px] dark:border-slate-700/20 w-full md:w-1/2"
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
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="font-montserrat">Confirm Logout</h3>
            </ModalHeader>
            <ModalBody>
              <p className="font-nunito text-lg">Are you sure to logout?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onCloseModal}>
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={() => navigate("/logout")}
              >
                Proceed
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmLogoutModal;
