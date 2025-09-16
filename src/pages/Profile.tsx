import { useState } from "react";
import UserPosts from "@/layouts/ProfileLayout/components/UserPosts";
import ProfileInfo from "@/layouts/ProfileLayout/components/ProfileInfo";
import CraetePostModal from "@/layouts/ProfileLayout/components/CraetePostModal";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <div className="title w-full bg-transparent pb-6">
        <h2 className="text-xl lg:text-2xl font-bold">صفحه من</h2>
      </div>

      <div className="profile-info w-full bg-transparent my-2">
        <ProfileInfo />
      </div>

      <div className="separator w-full h-px bg-gray-400 my-6"></div>

      <UserPosts onChangeModal={() => setIsModalOpen(true)} />

      <CraetePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
