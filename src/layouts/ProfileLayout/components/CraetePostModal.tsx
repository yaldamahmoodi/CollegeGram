import Modal from "@components/Modal";
import Stepper from "./Stepper";
import { steps } from "../consts/steps";

interface CraetePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CraetePostModal = (props: CraetePostModalProps) => {
  const { isOpen = false, onClose } = props;

  return (
    <Modal isOpen={isOpen} className="w-[500px]">
      <Stepper steps={steps} callbackHandler={onClose} />
    </Modal>
  );
};

export default CraetePostModal;
