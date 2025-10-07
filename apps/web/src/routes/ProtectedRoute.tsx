import { Outlet, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import ProfileLayout from "@/layouts/ProfileLayout";
import { useAuth } from "@hooks/useAuth";

const ProtectedRoute = () => {
  const { token } = useAuth();

  return token ? (
    <ProfileLayout>
      <Outlet />
    </ProfileLayout>
  ) : (
    <Navigate to={ROUTES.LOGIN} replace />
  );
};

export default ProtectedRoute;
