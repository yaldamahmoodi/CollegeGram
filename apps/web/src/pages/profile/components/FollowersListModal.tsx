import Button from "@components/Button";
import actionMenuIcon from "@assets/icons/actionMenu.svg";
import { useFollowersList } from "@/hooks/user.hook";
import type { FollowersType } from "@/types/user";
import NoUsernameImage from "@assets/images/username.png";

type FollowersListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  onItemAction?: (user: FollowersType) => void;
};

const FollowersListModal = (props: FollowersListModalProps) => {
  const {
    isOpen,
    onClose,
    title,
    actionLabel = "بستن",
    onAction,
    onItemAction,
  } = props;

  const { data: followers } = useFollowersList(isOpen);

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

        <div className="max-h-[300vh] h-[100px]  overflow-y-auto divide-y divide-gray-300 mb-5">
          {followers && followers.length > 0 ? (
            followers.map((user: FollowersType) => (
              <div
                key={user.userId}
                className="flex items-center justify-between px-2 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePhoto || NoUsernameImage}
                    alt={user.username}
                    className="h-15 w-15 rounded-full object-cover"
                  />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 pb-1">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.following_count || 0} دنبال‌کننده‌ها
                    </p>
                  </div>
                </div>

                {onItemAction && (
                  <button
                    onClick={() => onItemAction(user)}
                    className="text-red-500 text-2xl px-2">
                    <img src={actionMenuIcon} className="h-5" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-8">
              هنوز کسی دنبالت نمی کنه
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

export default FollowersListModal;
