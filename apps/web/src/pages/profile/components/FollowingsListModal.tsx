import { useState, useEffect } from "react";
import Button from "@components/Button";
import { useFollowingList, useUnFollow } from "@/hooks/user.hook";
import type { FollowingType } from "@/types/user";
import NoUsernameImage from "@assets/images/username.png";
import { useNavigate } from "react-router-dom";
import actionMenuImage from "@/assets/icons/actionMenu.svg";

type UnfollowPayload = {
  unfollowedUserId: string;
};

type FollowingListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  onItemAction?: (user: FollowingType) => void;
};

const FollowingListModal = (props: FollowingListModalProps) => {
  const { isOpen, onClose, title, actionLabel = "بستن", onAction } = props;

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { data: followings } = useFollowingList(isOpen);
  const navigate = useNavigate();
  const unFollowMutation = useUnFollow();

  const handleUnFollowUser = (user: FollowingType) => {
    const payload: UnfollowPayload = { unfollowedUserId: user.userId };
    unFollowMutation.mutate(payload);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    setOpenMenu(null);
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}>
      <div
        className="relative w-[380px] max-h-[80vh] overflow-hidden rounded-3xl bg-white shadow-lg py-15 px-10"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center font-bold mb-5">
          <h2 className="text-base text-gray-800">{title}</h2>
        </div>

        <div className="max-h-[300vh] h-[100px] overflow-y-auto divide-y divide-gray-300 mb-5">
          {followings && followings.length > 0 ? (
            followings.map((user: FollowingType) => (
              <div
                key={user.userId}
                className="flex items-center justify-between px-2 py-4 relative">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePhoto || NoUsernameImage}
                    alt={user.username}
                    className="h-15 w-15 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate(`/user/${user.username}`)}
                  />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 pb-1">
                      {`${user.firstname} ${user.lastname}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.following_count || 0} دنبال‌کننده‌ها
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setOpenMenu((prev) =>
                      prev === user.userId ? null : user.userId
                    )
                  }
                  className="p-2 text-gray-400 hover:text-gray-600">
                  <img src={actionMenuImage} alt="actions" />
                </button>

                {openMenu === user.userId && (
                  <div className="absolute left-0 top-10 bg-white rounded-2xl p-4 w-48 border border-gray-300 shadow-lg z-20">
                    <button
                      className="w-full text-right text-sm text-gray-700 hover:text-red-500"
                      onClick={() => handleUnFollowUser(user)}>
                      لغو دنبال کردن
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-8">
              هنوز کسی را دنبال نکردی
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button label={actionLabel} onClick={onAction || onClose} />
        </div>
      </div>
    </div>
  );
};

export default FollowingListModal;
