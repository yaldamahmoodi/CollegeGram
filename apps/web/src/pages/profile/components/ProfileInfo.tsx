import Button from "@components/Button";
import EditProfileModal from "@/pages/profile/components/EditProfileModal";
import { useState } from "react";
import { useUserInfo } from "@hooks/user.hook";
import { MESSAGES } from "@/const/message";
import UserListModal from "./FollowingsListModal";
import UsernameIcon from "@assets/images/username.png";

const ProfileInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);

  const { data: user } = useUserInfo();

  const mockUsers = [
    {
      id: 1,
      name: "متین دهقان",
      followersCount: 655,
      username: "matin",
      avatar: "https://i.pravatar.cc/153?img=4",
    },
    {
      id: 2,
      name: "علی رضایی",
      username: "ali",
      followersCount: 254,
      avatar: "https://i.pravatar.cc/153?img=7",
    },
    {
      id: 3,
      name: "سارا محمدی",
      followersCount: 120,
      username: "sara",
      avatar: "https://i.pravatar.cc/153?img=9",
    },
    {
      id: 4,
      name: "زهرا احدی زاده",
      followersCount: 24,
      username: "zahra",
      avatar: "https://i.pravatar.cc/153?img=10",
    },
    {
      id: 5,
      name: "رضا عبدلی",
      followersCount: 1023,
      username: "reza",
      avatar: "https://i.pravatar.cc/153?img=14",
    },
  ];
  console.log(user?.profilePhotoUrl);

  return (
    <div className="profile-info-container w-full flex flex-col lg:flex-row lg:items-start gap-6 py-4  flex flex-justify">
      <div className="flex justify-center lg:justify-start">
        <div className="bg-white rounded-full bg-cover object-cover ">
          <img
            src={user?.profilePhotoUrl ? user?.profilePhotoUrl : UsernameIcon}
            className="h-[134px] w-[134px] bg-cover no-repeat rounded-full"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
          <div className="flex flex-row items-center gap-2">
            <div className="text-lg md:text-2xl font-bold mb-1">
              {user?.firstname && user?.lastname
                ? `${user?.firstname}  ${user?.lastname}`
                : "کاربر کالج گرام"}
            </div>
            <span className="text-sm lg:text-base font-light mr-3 ">
              {user?.username}
            </span>
          </div>
        </div>

        <div className="flex flex-row justify-center lg:justify-start items-center  text-md w-full ">
          <div className="flex flex-row justify-start items-center lg:w-5/6">
            <div
              className="cursor-pointer text-orange-500 pl-4 border-l border-gray-500"
              onClick={() => setOpenFollowing(true)}>
              <span className="px-1">{user?.following_count || 0}</span>
              <span>{MESSAGES.following}</span>
            </div>
            <div
              className="cursor-pointer text-orange-500 px-4 border-l border-gray-500 "
              onClick={() => setOpenFollowers(true)}>
              <span className="px-1">{user?.follower_count || 0} </span>
              <span>{MESSAGES.follower}</span>
            </div>
            <div className="cursor-pointer px-4">
              <span className="px-1"> </span>
              <span>{user?.post_count || 0}</span>
              <span>{MESSAGES.post} </span>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/6 flex justify-end">
            <Button
              type="button"
              label="ویرایش پروفایل"
              variant="danger"
              className="lg:w-[197] h-[52px]"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        <div className="text-center lg:text-right text-xs lg:text-sm text-[#b5b5b5] mt-2">
          {user?.biography}
        </div>

        <div className="lg:hidden mt-4">
          <Button
            type="button"
            label="ویرایش پروفایل"
            variant="danger"
            className="w-full px-4 py-2 text-sm rounded-3xl h-[40px]"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <UserListModal
        isOpen={openFollowers}
        onClose={() => setOpenFollowers(false)}
        title="دنبال‌شونده‌ها"
        users={mockUsers}
        actionLabel="بستن"
        onItemAction={(user) => alert(`اکشن برای: ${user.name}`)}
      />
      <UserListModal
        isOpen={openFollowing}
        onClose={() => setOpenFollowing(false)}
        title="دنبال‌کننده‌ها"
        users={mockUsers}
        actionLabel="بستن"
        onItemAction={(user) => alert(`اکشن برای: ${user.name}`)}
      />
    </div>
  );
};

export default ProfileInfo;
