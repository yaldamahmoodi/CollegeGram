import Button from "@/components/Button";
import ChildrenModalProfilInfo from "@/layouts/ProfileLayout/components/ChildrenModalProfilInfo";
import { useState } from "react";

const ProfileInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="profile-info-container flex flex-auto h-[130px] w-full items-center py-2">
      <div className="profile-image w-1/6 border rounded-full h-[120px] w-[120px] ml-6">
        {/* <img src="" alt="Profile" /> */}
      </div>
      <div className="flex flex-col w-3/6 overflow-hidden justify-center">
        <div className="flex flex-row items-center pb-4">
          <span className="text-xl font-bold ml-4">sepideh shabrang</span>
          <span className="text-base font-light">shabrang70@</span>
        </div>
        <span className="text-[#b5b5b5]">
          this is a bio text in sepideh shabrang of college geram :)
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

      {/* Children Modal */}
      <ChildrenModalProfilInfo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProfileInfo;
