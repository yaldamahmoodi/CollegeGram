import notFound from "@assets/images/notFound.jpeg";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen bg-cover bg-center bg-no-repeat layout-container">
      <div className="h-screen flex items-center justify-center ">
        <div className="md:w-1/2 xs:max-w-[300px] bg-white md:px-20 md:py-10 p-5 flex opacity-90 flex-col  items-center justify-center rounded-3xl text-center">
          <img src={notFound} className="w-[400px] h-auto" />
          <div className="flex flex-col gap-2 mb-20 pb-0">
            <h2 className=" mb-5 md:text-2xl text-sm">
              صفحه ای که دنبالشی پیدا نشد :(
            </h2>
            <a href="#" onClick={() => navigate(-1)}>
              برگشت به صفحه قبل
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
