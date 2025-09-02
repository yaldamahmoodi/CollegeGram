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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onClickHandler={() => console.log("test")}
      labelHandler="بعدی">
      <Stepper steps={steps} />
    </Modal>
  );
};

export default CraetePostModal;
