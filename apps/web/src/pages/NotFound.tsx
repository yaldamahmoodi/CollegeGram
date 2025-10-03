import Button from "@components/Button";
import notFoundTop from "@assets/images/notfoundTop.svg";
import notFoundFooter from "@assets/images/notfoundfooter.svg";

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen relative h-screen ">
      <div className="h-screen flex items-center justify-center ">
        <div className="md:w-1/2 xs:max-w-[300px] bg-white  flex opacity-90 flex-col  items-center justify-center rounded-3xl text-center">
          <img src={notFoundTop} className="w-screen absolute top-0 left-0" />
          <img
            src={notFoundFooter}
            className="  w-screen absolute bottom-12 p-4 left-0"
          />

          <div className="relative">
            <h2 className="mb-5 md:text-2xl font-bold  text-sm">
              وای اینجا چه خبره؟!
            </h2>
            <h3 className="mb-5 md:text-xl font-normal text-sm">
              ظاهرا یک مشکلی وجود داره!{" "}
            </h3>
            <p className="mb-5 md:text-sm font-light text-sm w-[250px] md:w-[320px]">
              ما داریم تلاش می‌کنیم که برطرفش کنیم.لطفا چند دقیقه دیگه دوباره
              تلاش کن.
            </p>
            <Button label="بازگشت به صفحه قبل" onClick={() => navigate(-1)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
