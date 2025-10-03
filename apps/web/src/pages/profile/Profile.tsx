import { useState } from "react";
import UserPosts from "@/pages/profile/components/UserPosts";
import ProfileInfo from "@/pages/profile/components/ProfileInfo";
import CraetePostModal from "@/pages/profile/components/CreatePostModal";
import { useParams } from "react-router-dom";
import { useGetOtherUser } from "@/hooks/user.hook";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { username } = useParams<{ username: string }>();
  const { data: otherUser } = useGetOtherUser(username ?? null);
  return (
    <>
      <div className="title w-full bg-transparent pb-6">
        <h2 className="text-xl lg:text-2xl font-bold">صفحه من</h2>
      </div>

      <div className="profile-info w-full bg-transparent my-2">
        <ProfileInfo otherUser={otherUser} />
      </div>

      <div className="separator w-full h-px bg-gray-400 my-6"></div>

      <UserPosts
        otherUser={otherUser}
        onChangeModal={() => setIsModalOpen(true)}
      />

      <CraetePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Profile;
