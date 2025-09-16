import AuthLayout from "@/layouts/AuthLayout";
import ProfileLayout from "@/layouts/ProfileLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/Login";
import Profile from "@pages/Profile";
import Register from "@pages/Register";
import NotFound from "@pages/NotFound";
import Save from "@pages/Save";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./routes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route index element={<Navigate to={ROUTES.LOGIN} />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<ProfileLayout />}>
          <Route index element={<Profile />} />
        </Route>
      </Route>
        <Route path={ROUTES.SAVE} element={<Save/>} />
      <Route path={ROUTES.CATCH_ALL} element={<NotFound />} />
    </Routes>
  );
}
