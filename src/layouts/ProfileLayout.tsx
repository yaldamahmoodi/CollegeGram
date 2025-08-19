const profileLayout = () => {
  return (
    <div className="profile-container h-screen w-full bg-[#f5f5f5] px-10 pb-6 pt-8 flex flex-col">
      <div className="header w-full h-16 bg-transparent mb-4 flex items-center justify-between px-4 flex-row-reverse">
        {/* Logo Section (max width 111px, now on right) */}
        <div className="max-w-[111px] w-full flex items-center justify-end">
          <span className="font-bold text-lg">Logo</span>
        </div>

        {/* Button Section (same width as sidebar → 1/4 now) */}
        <div className="w-1/4 flex justify-center">Button</div>
      </div>

      <div className="flex flex-1 gap-4 flex-row-reverse">
        <div className=" left-section w-3/4 flex flex-col pr-8">
          <div className="title w-full bg-transparent p-4">
            <h2 className="text-lg font-medium">Title Section</h2>
          </div>

          <div className="profile-info w-full h-[147px] bg-transparent p-4">
            <p>Profile Container</p>
          </div>

          <div className="separator w-full h-px bg-gray-400 my-6"></div>

          <div className="profile-posts w-full flex-1 border border-gray-400 p-4 overflow-y-auto rounded-xl">
            <p>Profile Posts</p>
          </div>
        </div>

        <div className="right-sidbar w-1/4 p-4 border border-gray-400 rounded-xl">
          <h2 className="text-lg font-medium">Sidebar</h2>
        </div>
      </div>
    </div>
  );
};

export default profileLayout;
