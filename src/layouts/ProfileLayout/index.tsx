import ProfileInfo from "./components/ProfileInfo";
import Button from "@/components/Button";
const profileLayout = () => {
  return (
    <div className="profile-container h-screen w-full bg-[#f5f5f5] px-10 pb-6 pt-8 flex flex-col">
      <div className="header w-full max-h-[50px] bg-transparent mb-4 flex items-center justify-between px-4 flex-row">
        <div className="w-1/4 flex justify-center">
          <div className="w-3/6 flex flex-end justify-center justify-end">
            <Button
              type="button"
              label="+ افزودن پست جدید"
              variant="danger"
              className="text-basis py-1 text-xs rounded-4xl w-[197px] h-[52px]"
            />
          </div>
        </div>
        <div className="logo max-w-[111px] w-full h-[50px] flex items-center justify-end bg-cover bg-center bg-no-repeat" />
      </div>

      <div className="flex flex-auto gap-4 flex-row">
        <div className="right-sidebar w-1/4 p-4 border border-gray-400 rounded-xl">
          sidebar
        </div>
        <div className=" left-section w-3/4 flex flex-col pr-8">
          <div className="title w-full bg-transparent p-4">
            <h2 className="text-lg font-medium"> صفحه من</h2>
          </div>

          <div className="profile-info w-full max-h-[147px] bg-transparent">
            <ProfileInfo />
          </div>

          <div className="separator w-full h-px bg-gray-400 my-6"></div>

          <div className="profile-posts w-full h-full flex-auto border border-gray-400 p-4 overflow-y-auto rounded-xl">
            profile posts
          </div>
        </div>
      </div>
    </div>
  );
};

export default profileLayout;
