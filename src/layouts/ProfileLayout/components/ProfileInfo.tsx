import Button from "@components/Button";
import EditProfileModal from "@/layouts/ProfileLayout/components/EditProfileModal";
import { useState } from "react";
import { useUserInfo } from "@hooks/user.hook";
import { MESSAGES } from "@/const/message";

const ProfileInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useUserInfo();

  return (
    <div className="profile-info-container flex flex-auto h-[130px] w-full items-center py-2">
      <div className="profile-image flex items-center justify-end bg-cover bg-center bg-no-repeat w-1/6 border rounded-full h-[120px] w-[120px] ml-6 " />

      <div className="flex flex-col w-3/6 overflow-hidden justify-center">
        <div className="flex flex-row items-center pb-4">
          <span className="text-xl font-bold ml-4"> مهشید منزه</span>
          <span className="text-base font-light">@mahnaz</span>
        </div>
        <div className="follower-following-info flex flex-row justify-start items-center pb-4">
          <div className="followings border-l border-gray-900 pl-4 text-orange-500">
            <span className="px-2">13</span>
            <span>{MESSAGES.following}</span>
          </div>
          <div className="followers border-l border-gray-900 px-4 text-orange-500">
            <span className="px-2">44</span>
            <span>{MESSAGES.follower}</span>
          </div>
          <div className="posts px-4">
            <span className="px-2">35</span>
            <span>{MESSAGES.post}</span>
          </div>
        </div>
        <span className="text-[#b5b5b5]">
          Lover ,not a tighter , spreading ok. all over the world
        </span>
      </div>
      <div className="w-2/6 flex justify-end">
        <Button
          type="button"
          label="ویرایش پروفایل"
          variant="danger"
          className="px-5 py-1 text-xs rounded-4xl w-[197px] h-[52px]"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProfileInfo;
