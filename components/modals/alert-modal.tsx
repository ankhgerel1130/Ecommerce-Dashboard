import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  storeName: string; // New prop for store name
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  storeName,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={`Are you sure you want to delete "${storeName}"?`}
      description={`This action will permanently delete the store "${storeName}".`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClose} // Close the modal
        >
          Cancel
        </Button>

        <Button
          disabled={loading}
          variant="destructive"
          onClick={onConfirm} // Trigger the delete action
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
