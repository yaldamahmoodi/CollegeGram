import type React from "react";
import UserPostUploader from "../components/UserPostUploader";
import CaptionWithEmojis from "../components/CaptionWithEmojis";
import MentionInput from "../components/MentionInput";

type StepType = { title: string; content: React.ReactNode };

export const steps: StepType[] = [
  { title: "عکس", content: <UserPostUploader /> },
  { title: "متن", content: <CaptionWithEmojis/> },
  {
    title: "تنظیمات",
    content: (
      <MentionInput
        users={["@ali", "@zahra", "@sara"]}
        handlePostSubmit={() => {
          console.log();
        }}
      />
    ),
  },
];
