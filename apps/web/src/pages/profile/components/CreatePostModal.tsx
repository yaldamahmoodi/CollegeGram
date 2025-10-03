import Modal from "@components/Modal";
import Stepper from "./Stepper";
import UserPostUploader from "./UserPostUploader";
import CaptionWithEmojis from "./CaptionWithEmojis";
import MentionInput from "./MentionInput";
import { useEffect, useState } from "react";
import { useCreatePost } from "@/hooks/post.hook";
import type { MentionsType } from "@app-types/post";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Mention {
  userId: string;
  username: string;
}

const CreatePostModal = (props: CreatePostModalProps) => {
  const { isOpen = false, onClose } = props;
  const { mutate: createPostMutation, isSuccess } = useCreatePost();
  const [photos, setPhotos] = useState<File[]>([]);
  const [caption, setCaption] = useState<string>("");
  const [mentions, setMentions] = useState<MentionsType[]>([]);
  const [isClose, setIsClose] = useState<boolean>(false);

  const handlePostSubmit = async () => {
    const payload = { photos, caption, mentions, isClose };
    createPostMutation(payload);

    onClose();
  };
  useEffect(() => {
    setPhotos([]);
    setCaption("");
    setMentions([]);
  }, [onClose]);

  type StepType = { title: string; content: React.ReactNode };

  const steps: StepType[] = [
    {
      title: "عکس",
      content: <UserPostUploader images={photos} onChange={setPhotos} />,
    },
    {
      title: "متن",
      content: <CaptionWithEmojis value={caption} onChange={setCaption} />,
    },
    {
      title: "تنظیمات",
      content: (
        <div className="flex flex-col gap-4">
          <MentionInput
            mentions={mentions}
            setMentions={setMentions}
            handlePostSubmit={handlePostSubmit}
            isClose={isClose}
            setIsClose={setIsClose}
          />
        </div>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} size={"medium"}>
      <Stepper steps={steps} callbackHandler={onClose} />
    </Modal>
  );
};

export default CreatePostModal;
