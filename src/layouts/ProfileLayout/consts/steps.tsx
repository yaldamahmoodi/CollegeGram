import type React from "react";
import UserPostUploader from "../components/UserPostUploader";
import CaptionWithEmojis from "../components/CaptionWithEmojis";

type StepType = { title: string; content: React.ReactNode };

export const steps: StepType[] = [
  { title: "عکس", content: <UserPostUploader /> },
  { title: "متن", content: <CaptionWithEmojis /> },
  { title: "تنظیمات", content: <>setting component</> },
];
