import AuthContainer from "@/layouts/AuthLayout/components/AuthContainer";
import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <div className="w-full h-full min-h-screen justify-center items-center py-1 bg-cover bg-center bg-no-repeat layout-container">
      <div className="bg-center backdrop-blur-xs  min-h-screen flex items-center justify-center">
        <AuthContainer>
          <Outlet />
        </AuthContainer>
      </div>
    </div>
  );
};

export default AuthLayout;
