import Modal from "@/components/Modal";
import UserPostUploader from "./UserPostUploader";
import type React from "react";

interface CraetePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CraetePostModal: React.FC<CraetePostModalProps> = ({
  isOpen = false,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <UserPostUploader onClose={onClose} />
    </Modal>
  );
};

export default CraetePostModal;
