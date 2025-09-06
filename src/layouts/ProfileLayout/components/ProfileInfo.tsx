import Button from "@components/Button";
import EditProfileModal from "@/layouts/ProfileLayout/components/EditProfileModal";
import { useState } from "react";
import { useUserInfo } from "@hooks/user.hook";
import { MESSAGES } from "@/const/message";
import UserListModal from "./UserListModal";

const ProfileInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);

  const { data } = useUserInfo();

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

  return (
    <div className="profile-info-container w-full flex flex-col lg:flex-row lg:items-start gap-6 py-4">
      <div className="flex justify-center lg:justify-start">
        <div className="profile-image bg-cover bg-center bg-no-repeat border rounded-full h-[80px] w-[80px] lg:h-[150px] lg:w-[150px]" />
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
          <div className="flex flex-row items-center gap-2">
            <span className="text-lg lg:text-2xl font-bold">مهشید منزه</span>
            <span className="text-sm lg:text-base font-light">@mahnaz</span>
          </div>
        </div>

        {/* ردیف فالو/فالوئر/پست + دکمه */}
        <div className="flex flex-row justify-center lg:justify-start items-center mt-4 text-sm w-full ">
          <div className="flex flex-row justify-start items-center lg:w-5/6">
            <div
              className="cursor-pointer text-orange-500 px-3 border-l border-gray-500"
              onClick={() => setOpenFollowing(true)}>
              <span className="px-1">13</span>
              <span>{MESSAGES.following}</span>
            </div>
            <div
              className="cursor-pointer text-orange-500 px-3 border-l border-gray-500 "
              onClick={() => setOpenFollowers(true)}>
              <span className="px-1">44</span>
              <span>{MESSAGES.follower}</span>
            </div>
            <div className="cursor-pointer px-3">
              <span className="px-1">35</span>
              <span>{MESSAGES.post}</span>
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

        {/* بیو */}
        <div className="mt-4 text-center lg:text-right text-xs lg:text-sm text-[#b5b5b5]">
          Lover ,not a tighter , spreading ok. all over the world
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

      {/* مودال‌ها */}
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
