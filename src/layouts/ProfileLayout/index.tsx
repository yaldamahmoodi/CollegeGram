import { useEffect, useState } from "react";
import ProfileInfo from "./components/ProfileInfo";
import Button from "@/components/Button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CraetePostModal from "./components/CraetePostModal";
import SideBar from "./components/SideBar";

const ProfileLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUserRequest = async () => {
    const { data } = await axios.get(
      "http://130.185.75.174:3001/api/v1/auth/user",
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserRequest,
    onSuccess: (data) => console.log(data),
    onError: (err) => console.error(err),
  });

  return (
    <div className="profile-container min-h-screen w-full bg-[#f5f5f5] px-4 sm:px-6 lg:px-10 py-6 flex flex-col">
      {/* Header */}
      <div className="header w-full max-h-[60px] bg-transparent mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-4">
        <div className="flex justify-center sm:justify-start">
          <Button
            type="button"
            label="+  پست جدید"
            variant="danger"
            className="flex justify-center items-center text-sm sm:text-md rounded-3xl w-full sm:w-[220px] lg:w-[264px] h-[46px] sm:h-[52px] px-6 sm:px-8"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <div className="logo w-[90px] sm:w-[111px] h-[40px] sm:h-[50px] flex items-center justify-center bg-cover bg-center bg-no-repeat" />
      </div>

      <div className="flex flex-auto gap-4 flex-row">
        <div className="right-sidebar w-1/4 p-4 border border-gray-400 rounded-4xl">
          <SideBar />
        </div>

        {/* Left Section */}
        <div className="left-section w-full lg:w-3/4 flex flex-col lg:pr-8">
          <div className="title w-full bg-transparent pb-6">
            <h2 className="text-xl sm:text-2xl font-bold">صفحه من</h2>
          </div>

          {/* Profile Info */}
          <div className="profile-info w-full bg-transparent mb-6">
            <ProfileInfo />
          </div>

          <div className="separator w-full h-px bg-gray-300 mb-6"></div>

          {/* Posts */}
          <div className="profile-posts w-full flex-auto border border-gray-300 p-4 overflow-y-auto rounded-3xl">
            {0 ? (
              ""
            ) : (
              <div className="flex flex-col justify-center items-center gap-2 w-full h-full text-center">
                <span className="text-sm sm:text-base">
                  هنوز هیچ پستی توی صفحه‌ات نذاشتی!
                </span>
                <span className="text-xs sm:text-sm">بجنب تا دیر نشده</span>
                <Button
                  type="button"
                  label="+  ایجاد پست جدید"
                  variant="danger"
                  className="text-xs sm:text-sm py-2 rounded-3xl w-full sm:w-[197px] h-[44px] sm:h-[52px] mt-5"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <CraetePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProfileLayout;
