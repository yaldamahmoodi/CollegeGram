import UserListItem from "./components/UserListItem";
import NavTabs from "./components/NavTabs";
import removeUserIcon from "@assets/icons/removeUser.svg";
import blockUserIcon from "@assets/icons/blockUser.svg";
import {
  useAddUserBlockList,
  useCloseFiendList,
  useRemoveCloseFriend,
} from "@/hooks/user.hook";
import type { CloseFriend as CloseFriendType } from "@/types/user";

const CloseFriends = () => {
  const { data: closeFriendList } = useCloseFiendList();
  const addUserBlockList = useAddUserBlockList();
  const removeCloseFriendMutation = useRemoveCloseFriend();

  return (
    <div className="w-full h-screen flex flex-col p-6">
      <NavTabs />
      <div className="1/3">
        {closeFriendList?.length > 0
          ? closeFriendList?.map((friend: CloseFriendType) => (
              <UserListItem
                key={friend.friend_info._id}
                user={friend.friend_info}
                actions={[
                  {
                    label: "حذف از دوستان نزدیک",
                    icon: <img src={removeUserIcon} />,
                    onClick: () => {
                      removeCloseFriendMutation.mutate({
                        friendId: friend?.friend_info?._id,
                      });
                    },
                  },
                  {
                    label: "بلاک کردن",
                    icon: <img src={blockUserIcon} />,
                    onClick: () => {
                      addUserBlockList.mutate({
                        blockUserId: friend?.friend_info?._id,
                      });
                    },
                  },
                ]}
              />
            ))
          : "تو هنوز دوست نزدیکی نداری !"}
      </div>
    </div>
  );
};

export default CloseFriends;
