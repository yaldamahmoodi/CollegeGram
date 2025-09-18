import Modal from "@components/Modal";
import Stepper from "./Stepper";
import UserPostUploader from "../components/UserPostUploader";
import CaptionWithEmojis from "../components/CaptionWithEmojis";
import MentionInput from "../components/MentionInput";
import { useState } from "react";
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

  const createPostMutation = useCreatePost();

  const [photos, setPhotos] = useState<File[]>([]);
  const [caption, setCaption] = useState<string>("");
  const [mentions, setMentions] = useState<MentionsType[]>([]);

  const handlePostSubmit = async () => {
    const payload = { photos, caption, mentions };
    createPostMutation.mutate(payload);
    onClose();
  };

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
        <MentionInput
          users={[
            { user_id: "1", username: "ali" },
            { user_id: "2", username: "zahra" },
            { user_id: "3", username: "sara" },
          ]}
          mentions={mentions}
          setMentions={setMentions}
          handlePostSubmit={handlePostSubmit}
        />
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} className="w-[500px]">
      <Stepper steps={steps} callbackHandler={onClose} />
    </Modal>
  );
};

export default CreatePostModal;
