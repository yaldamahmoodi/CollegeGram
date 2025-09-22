import { Outlet, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import ProfileLayout from "@/layouts/ProfileLayout";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? (
    <ProfileLayout>
      <Outlet />
    </ProfileLayout>
  ) : (
    <Navigate to={ROUTES.LOGIN} replace />
  );
};

export default ProtectedRoute;
