import { Outlet, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;
