import { useEffect, useState } from "react";
import ProfileInfo from "./components/ProfileInfo";
import Button from "@/components/Button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CraetePostModal from "./components/CraetePostModal";
import SideBar from "./components/SideBar";

const ProfileLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {}, []);

  const getUserRequest = async () => {
    const [posts, setPosts] = useState([]);

    const { data } = await axios.get(
      "http://130.185.75.174:3001/api/v1/auth/user",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserRequest,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <div className="profile-container h-screen w-full bg-[#f5f5f5] px-10 pb-6 pt-8 flex flex-col">
      <div className="header w-full max-h-[50px] bg-transparent mb-4 flex items-center justify-between px-4 flex-row">
        <div className="w-1/4 flex justify-center">
          <div className="flex justify-center items-center">
            <Button
              type="button"
              label="+  پست جدید"
              variant="danger"
              className="flex justify-center items-center text-md rounded-4xl w-[264px] h-[52px] gap-8 px-16 py-8"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
        <div className="logo w-[111px] h-[50px] flex items-center justify-end bg-cover bg-center bg-no-repeat" />
      </div>

      <div className="flex flex-auto gap-4 flex-row">
        <div className="right-sidebar w-1/4 p-4 border border-gray-400 rounded-4xl">
          <SideBar />
        </div>
        <div className=" left-section w-3/4 flex flex-col pr-8">
          <div className="title w-full bg-transparent pb-10">
            <h2 className="text-2xl font-bold "> صفحه من</h2>
          </div>

          <div className="profile-info w-full max-h-[147px] bg-transparent my-2">
            <ProfileInfo />
          </div>

          <div className="separator w-full h-px bg-gray-400 my-6"></div>

          <div className="profile-posts w-full h-full flex-auto border border-gray-400 p-4 overflow-y-auto rounded-4xl">
            {0 ? (
              ""
            ) : (
              <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
                <span>هنوز هیچ پستی توی صفحه ات نذاشتی!</span>
                <span>بجنب تا دیر نشده</span>
                <Button
                  type="button"
                  label="+  ایجاد پست جدید"
                  variant="danger"
                  className="text-basis py-1 text-xs rounded-4xl w-[197px] h-[52px] mt-5"
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
