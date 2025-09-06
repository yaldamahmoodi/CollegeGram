import Button from "@/components/Button";
import React, { useState } from "react";

interface MentionInputProps {
  users: string[];
  handlePostSubmit?: () => void;
}

const MentionInput = ({ users, handlePostSubmit }: MentionInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isMentioning, setIsMentioning] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const mentionPart = value.split("@").pop()?.trim() || "";

    if (mentionPart.length > 0) {
      setIsMentioning(true);
      const filteredUsers = users.filter((user) =>
        user.toLowerCase().includes(mentionPart.toLowerCase())
      );
      setSuggestedUsers(filteredUsers);
    } else {
      setIsMentioning(false);
      setSuggestedUsers([]);
    }
  };

  const handleUserSelect = (user: string) => {
    setInputValue(inputValue.replace(/@[\w]*$/, `@${user}`));
    setIsMentioning(false);
    setSuggestedUsers([]);
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
      {isMentioning && suggestedUsers.length > 0 && (
        <ul className="absolute bg-white border rounded-md shadow-lg w-full mt-1 max-h-40 overflow-auto z-10">
          {suggestedUsers.map((user) => (
            <li
              key={user}
              onClick={() => handleUserSelect(user)}
              className="p-2 cursor-pointer hover:bg-gray-200">
              @{user}
            </li>
          ))}
        </ul>
      )}
      <Button onClick={handlePostSubmit} label=" ثبت و انتشار پست" />
    </div>
  );
};

export default MentionInput;
