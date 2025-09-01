import Modal from "@components/Modal";
import UserPostUploader from "./UserPostUploader";
import type React from "react";
import Stepper from "./Stepper";
import CaptionWithEmojis from "./CaptionWithEmojis";
interface CraetePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CraetePostModal: React.FC<CraetePostModalProps> = ({
  isOpen = false,
  onClose,
}) => {
  const steps = [
    { title: "عکس", content: <UserPostUploader /> },
    { title: "متن", content: <CaptionWithEmojis /> },
    { title: "تنظیمات", content: <>setting component</> },
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Stepper steps={steps} />
    </Modal>
  );
};

export default CraetePostModal;
