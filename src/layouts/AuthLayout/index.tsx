import AuthContainer from "@/layouts/AuthLayout/components/AuthContainer";
import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <div className="w-screen h-screen bg-cover bg-center bg-no-repeat layout-container">
      <div className="bg-center bg-opacity-50 h-screen flex items-center justify-center">
        <AuthContainer>
          <Outlet />
        </AuthContainer>
      </div>
    </div>
  );
};

export default AuthLayout;
