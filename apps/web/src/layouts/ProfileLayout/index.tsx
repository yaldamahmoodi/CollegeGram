import {  useState, type ReactNode } from "react";
import Button from "@/components/Button";
import CraetePostModal from "../../pages/profile/components/CreatePostModal";
import ProfileSidebarMenu from "./components/sidebar/SidebarMenu";
import avatar from "@assets/images/username.png";
import searchIcon from "@assets/icons/Mobile/Search.svg";
import gridMenuIcon from "@assets/icons/Mobile/gridMenu.svg";
import hamburgerMenuIcon from "@assets/icons/Mobile/hamburgerMenu.svg";
import plusIcon from "@assets/icons/plus.svg";
import logo from "@assets/images/logo.png";
import { useUserInfo } from "@hooks/user.hook.ts";
import BottomSheet from "@components/BottomSheet";
import MobileSidebarMenu from "@/layouts/ProfileLayout/components/sidebar/MobileSidebarMenu.tsx";
import { useWebSocket } from "@/hooks/useWebSocket.hook";
import NotificationToast from "@/components/NotificationToast";

interface ProfileLayoutProps {
    children: ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Initialize WebSocket connection
  const token = localStorage.getItem("token");
  useWebSocket(token || undefined);
    const { data: user } = useUserInfo();

    return (
        <div className="profile-container min-h-screen h-full w-full bg-[#f5f5f5] flex flex-col lg:p-10">
            <div className="header w-full h-[60px] bg-transparent mb-4 flex items-center justify-between px-4">
                <div className="lg:hidden flex items-center justify-center">
                    <img
                        src={user?.profilePhotoUrl || avatar}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>

                <button
                    className="lg:hidden flex items-center justify-center m-0 p-0 bg-transparent"
                    onClick={() => setIsMenuSheetOpen(true)}
                    aria-label="open menu"
                >
                    <img src={hamburgerMenuIcon} className="h-7" />
                </button>

                <div className="hidden lg:flex w-1/4 justify-between items-center">
                    <Button
                        type="button"
                        label=" پست جدید"
                        icon={<img src={plusIcon} />}
                        variant="danger"
                        className="flex justify-center items-center text-sm rounded-4xl lg:w-[300px] lg:h-[44px] gap-4"
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>

                <img src={logo} className="hidden lg:block h-max w-auto" />
            </div>

            <div className="flex flex-auto gap-4 flex-row">
                <div className="hidden lg:block bg-white right-sidebar w-1/4 p-4 border border-gray-400 rounded-4xl">
                    <ProfileSidebarMenu />
                </div>
                <div className="left-section w-full mb-[76px] md:mb-0 lg:w-3/4 flex flex-col px-4 lg:px-15">
                    {children}
                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white border-t border-gray-300 flex justify-around items-center z-30">
                <button className="flex flex-col items-center">
                    <img src={searchIcon} className="h-5" />
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex flex-col text-xs items-center justify-center border bg-red-500 w-10 h-10 rounded-full text-white"
                    aria-label="new post"
                >
                    ＋
                </button>
                <button className="flex flex-col items-center">
                    <img src={gridMenuIcon} className="h-5" />
                </button>
            </div>

            <BottomSheet
                isOpen={isMenuSheetOpen}
                onClose={() => setIsMenuSheetOpen(false)}
                className="px-0"
                buttonGroupClassName="px-4"
                labelClose="بستن"
            >
                <MobileSidebarMenu />
            </BottomSheet>

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
      
      
      {/* Notification Toast Container */}
      <NotificationToast />
        </div>
    );
};

export default ProfileLayout;
