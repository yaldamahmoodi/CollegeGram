import Modal from "@components/Modal";
import Stepper from "./Stepper";
import UserPostUploader from "./UserPostUploader";
import CaptionWithEmojis from "./CaptionWithEmojis";
import MentionInput from "./MentionInput";
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
  const [isClose, setIsClose] = useState<boolean>(false);

  const handlePostSubmit = async () => {
    const payload = { photos, caption, mentions, isClose };
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
    <Modal
        isOpen={isOpen}
        size={"medium"}
        className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2/6 mx-auto"
    >
        <Stepper
            steps={steps}
            callbackHandler={onClose}
            handlePostSubmit={handlePostSubmit}
        />
    </Modal>
  );
};

export default CreatePostModal;
