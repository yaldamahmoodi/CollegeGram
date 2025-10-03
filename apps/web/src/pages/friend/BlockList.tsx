import UserListItem from "./components/UserListItem";
import NavTabs from "./components/NavTabs";
import removeUserIcon from "@assets/icons/removeUser.svg";
import blockUserIcon from "@assets/icons/blockUser.svg";
import {
  useAddUserBlockList,
  useBlockList,
  useRemoveUserBlockList,
} from "@/hooks/user.hook";

const BlockedFriends = () => {
  const { data: blockList } = useBlockList();
  const addUserBlockListMutation = useAddUserBlockList();
  const removeUserBlockListMutation = useRemoveUserBlockList();
  return (
    <div className="w-full h-screen flex flex-col p-6">
      <NavTabs />
      <div className="1/3">
        {blockList?.length > 0
          ? blockList?.map((blocked) => (
              <UserListItem
                key={blocked.id}
                user={blocked}
                actions={[
                  {
                    label: "افزودن به دوستان نزدیک",
                    icon: <img src={removeUserIcon} />,
                    onClick: () => {
                      addUserBlockListMutation.mutate({
                        friendId: blocked.friend_info?._id,
                      });
                    },
                  },
                  {
                    label: "حذف از بلاک ها",
                    icon: <img src={blockUserIcon} />,
                    onClick: () => {
                      removeUserBlockListMutation.mutate({
                        friendId: blocked.friend_info?._id,
                      });
                    },
                  },
                ]}
              />
            ))
          : "تو هنوز کسی را در لیست سیاه نداری   !"}
      </div>
    </div>
  );
};

export default BlockedFriends;
