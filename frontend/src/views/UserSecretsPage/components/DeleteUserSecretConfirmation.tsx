import { useDeleteUserSecret } from "@app/hooks/api/userSecrets";
import { Modal, ModalContent, Button } from "@app/components/v2";

export const DeleteUserSecretConfirmationModal = ({
  id,
  open,
  setOpen
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { mutateAsync: deleteUserSecret } = useDeleteUserSecret();
  return (
    <Modal isOpen={open}>
      <ModalContent onClose={() => { setOpen(false) }} title="Confirmation">
        <div>
          <h2 className="text-lg font-semibold text-center">Are you sure you want to delete this secret?</h2>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                setOpen(false);
                deleteUserSecret({ id });
              }}
              className="mr-2"
            >
              Yes
            </Button>
            <Button onClick={() => { setOpen(false) }}>No</Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}