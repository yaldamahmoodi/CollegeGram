import Button from "@/components/Button";

const ProfileInfo = () => {
  return (
    <div className="profile-info-container flex flex-auto h-[130px] w-full items-center py-2">
      <div className="profile-image w-1/6 border rounded-full h-[120px] w-[120px] ml-6 ">
        {/* <imag src=""></imag> */}
      </div>
      <div className="flex flex-col w-3/6 overflow-hidden justify-center">
        <div className="flex flex-row flex-start items-center pb-4">
          <span className="text-xl font-bold ml-4">sepideh shabrang</span>
          <span className="text-base font-light">shabrang70@</span>
        </div>
        <span className="text-[#b5b5b5]">
          this is a bio text in sepideh shabrang of college geram :)
        </span>
      </div>
      <div className="w-2/6 flex flex-end justify-center justify-end">
        <Button
          type="button"
          label="ویرایش پروفایل"
          variant="danger"
          className="px-2 py-1 text-xs rounded-4xl w-[197px] h-[52px] px-5"
        />
      </div>
    </div>
  );
};

export default ProfileInfo;
