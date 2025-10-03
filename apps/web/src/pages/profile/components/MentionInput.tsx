import Button from "@/components/Button";
import React, { useState } from "react";
import type { MentionsType } from "@app-types/post";
import { useSearchUsers } from "@/hooks/user.hook";
import Switch from "@/components/Switch";

interface MentionInputProps {
  users?: MentionsType[];
  mentions: MentionsType[];
  isClose: boolean;
  setIsClose: (v: boolean) => void;
  setMentions: (v: MentionsType[]) => void;
  handlePostSubmit?: () => void;
}

const MentionInput = ({
  mentions,
  isClose,
  setIsClose,
  setMentions,
  handlePostSubmit,
}: MentionInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isMentioning, setIsMentioning] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");

  const { data: searchData } = useSearchUsers(mentionQuery, 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const mentionPart = value.split("@").pop()?.trim() || "";
    const endsWithAt = value.endsWith("@");

    if (endsWithAt || mentionPart.length > 0) {
      setIsMentioning(true);
      setMentionQuery(mentionPart.length > 0 ? mentionPart : "");
    } else {
      setIsMentioning(false);
      setMentionQuery("");
    }
  };

  const handleUserSelect = (user: MentionsType) => {
    if (!mentions.some((m) => m.user_id === user.user_id)) {
      setMentions([...mentions, user]);
    }
    setInputValue("");
    setIsMentioning(false);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mt-5">
      <span className="flex justify-center my-8 pt-5">
        اینجا می‌تونی دوستانت رو منشن کنی
      </span>
      <input
        type="text"
        className="w-full p-3 bg-white border rounded-xl border-gray-400 h-[76px] min-w-[340px] mb-5"
        value={inputValue}
        onChange={handleChange}
      />
      {isMentioning && (
        <ul className="absolute bg-white border rounded-md shadow-lg w-full mt-1 max-h-40 overflow-auto z-10">
          {searchData && searchData.users.length > 0 ? (
            searchData.users.map((user) => (
              <li
                key={user.id}
                onClick={() =>
                  handleUserSelect({
                    user_id: user.id,
                    username: user.username,
                  })
                }
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                @{user.username}
              </li>
            ))
          ) : (
            <li className="p-2 text-sm text-gray-500 select-none">
              نام کاربری را تایپ کنید…
            </li>
          )}
        </ul>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        {mentions.map((m) => (
          <span
            key={m.user_id}
            className="px-2 py-1 bg-orange-100 text-orange-700 rounded-xl text-sm"
          >
            @{m.username}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm select-none">
          فقط برای دوستان نزدیک نمایش بده
        </span>

        <button
          type="button"
          onClick={() => setIsClose(!isClose)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
            isClose ? "bg-[#E7000B]" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
              isClose ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      <Button
        onClick={handlePostSubmit}
        label=" ثبت و انتشار پست"
        className="absolute top-65 right-0"
      />
    </div>
  );
};

export default MentionInput;
