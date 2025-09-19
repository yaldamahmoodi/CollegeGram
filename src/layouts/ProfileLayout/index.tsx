import { useState } from "react";
import Button from "@/components/Button";
import CraetePostModal from "./components/CraetePostModal";
import ProfileSidebarMenu from "./components/ProfileSidebarMenu";
import profilePhoto from "@/assets/images/avatar.png";
import searchIcon from "@assets/icons/Mobile/Search.svg";
import gridMenuIcon from "@assets/icons/Mobile/gridMenu.svg";
import hamburgerMenuIcon from "@assets/icons/Mobile/hamburgerMenu.svg";
import plusIcon from "@assets/icons/plus.svg";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="profile-container h-screen w-full bg-[#f5f5f5] flex flex-col lg:p-10">
      <div className="header w-full h-[60px] bg-transparent mb-4 flex items-center justify-between px-4">
        <div className="lg:hidden flex items-center justify-center">
          <img
            src={profilePhoto}
            alt="profile"
            className="w-9 h-9 rounded-full border"
          />
        </div>

        <button
          className="lg:hidden flex items-center justify-center"
          onClick={() => setIsSidebarOpen(true)}>
          <img src={hamburgerMenuIcon} className="h-7" />
        </button>

        <div className="hidden lg:flex w-1/4 justify-center">
          <Button
            type="button"
            label=" پست جدید"
            icon={<img src={plusIcon} />}
            variant="danger"
            className="flex justify-center items-center text-sm rounded-4xl lg:w-[300px] lg:h-[44px] gap-4"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <div className="hidden lg:block logo w-[111px] h-[50px] bg-cover bg-center bg-no-repeat" />
      </div>
      <div className="flex flex-auto gap-4 flex-row">
        <div className="hidden lg:block bg-white right-sidebar w-1/4 p-4 border border-gray-400 rounded-4xl">
          <ProfileSidebarMenu />
        </div>
        <div className="left-section w-full lg:w-3/4 flex flex-col px-4 lg:px-15">
          <Outlet />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white border-t border-gray-300 flex justify-around items-center z-30">
        <button className="flex flex-col items-center">
          <img src={searchIcon} className="h-5" />
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col text-xs items-center justify-center text-red-500  border bg-red-500 w-10 h-10 rounded-full text-white">
          ＋
        </button>
        <button className="flex flex-col items-center">
          <img src={gridMenuIcon} className="h-5" />
        </button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative bg-white w-64 h-full shadow-lg p-4 z-50">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={() => setIsSidebarOpen(false)}>
              ✕
            </button>
            <ProfileSidebarMenu />
          </div>
        </div>
      )}

      <CraetePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProfileLayout;
