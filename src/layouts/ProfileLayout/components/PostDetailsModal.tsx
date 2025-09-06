import ImageSlider from "@components/Image.tsx";
import Modal from "@components/Modal.tsx";


interface PostDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[]
}

const PostDetailsModal = (props: PostDetailsModalProps) => {
    const {
        isOpen,
        onClose,
        images
    } = props;

if (!isOpen) return null;
 return (
     <Modal
     isOpen={isOpen}
     onClose={onClose}
     size="medium"
     labelClose="✕"
        >
         <ImageSlider images={images} />
     </Modal>
         );
};
export default PostDetailsModal;