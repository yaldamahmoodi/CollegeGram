import { useState, useRef, useEffect } from "react";
import actionMenuImage from "@/assets/icons/actionMenu.svg";
import type { FriendInfo } from "@/types/user";
import noUserIcon from "@assets/images/notFound.jpeg";
type Action = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

interface UserItemProps {
  user: FriendInfo;
  actions: Action[];
}

const UserListItem = ({ user, actions }: UserItemProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center relative w-[350px] py-3" ref={menuRef}>
      <div className="w-full flex items-center gap-3 justify-start">
        <img
          src={user.profilePhoto || noUserIcon}
          alt={user.username}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex flex-col text-sm text-gray-700 mr-5">
          <span className="pb-2 font-bold">
            {user.firstname} {user.lastname}
          </span>
          <span className="text-xs text-gray-600">
            {user.followerCount | 0} دنبال کننده
          </span>
        </div>
      </div>

      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="p-2 text-gray-400 hover:text-gray-600">
        <img src={actionMenuImage} />
      </button>

      {openMenu && (
        <div className="absolute right-90 top-0 mt-2 bg-white rounded-3xl rounded-tr-none p-4 py-8 w-60 space-y-4 border border-gray-300 z-20">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setOpenMenu(false);
              }}
              className="flex items-center mb-8 text-sm text-gray-700 hover:text-red-500 w-full text-right">
              <span className="ml-3">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserListItem;
