import Button from "@components/Button";
import actionMenuIcon from "@assets/icons/actionMenu.svg";
import { useFollowersList } from "@/hooks/user.hook";
import type { FollowersType } from "@/types/user";

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

  const { data: followers } = useFollowersList();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}>
      <div className="relative w-[380px] max-h-[80vh] overflow-hidden rounded-3xl bg-white shadow-lg py-15 px-10">
        <div className="text-center font-bold mb-5">
          <h2 className="text-base text-gray-800">{title}</h2>
        </div>

        <div className="max-h-[55vh] overflow-y-auto divide-y divide-gray-300 mb-5">
          {followers.length
            ? followers?.map((user: FollowersType) => (
                <div
                  key={user?.userId}
                  className="flex items-center justify-between px-2 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.profilePhoto}
                      alt={user?.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800 pb-1">
                        ` ${user?.firstname} ${user?.lastname}`
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.follower_count || 0} هزار دنبال‌کننده‌ها
                      </p>
                    </div>
                  </div>

                  {onItemAction && (
                    <button
                      onClick={() => onItemAction(user)}
                      className="text-red-500 text-2xl px-2 ">
                      <img src={actionMenuIcon} className="h-5" />
                    </button>
                  )}
                </div>
              ))
            : "هنوز کسی دنبالت نکرده"}
        </div>

        <div className="flex justify-end">
          <Button label={actionLabel} onClick={onAction || onClose} />
        </div>
      </div>
    </div>
  );
};

export default FollowersListModal;
