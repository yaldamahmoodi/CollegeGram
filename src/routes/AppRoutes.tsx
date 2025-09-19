import AuthLayout from "@/layouts/AuthLayout";
import ProfileLayout from "@/layouts/ProfileLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/Login";
import Profile from "@pages/Profile";
import Register from "@pages/Register";
import NotFound from "@pages/NotFound";
import Save from "@/pages/SavedPosts";
import ProtectedRoute from "./ProtectedRoute";
import TagPage from "@/pages/TaggedPosts";
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
          <Route path={ROUTES.TAGGED_POSTS} element={<TagPage />} />
          <Route path={ROUTES.SAVED_POSTS} element={<Save />} />
        </Route>
      </Route>

      <Route path={ROUTES.CATCH_ALL} element={<NotFound />} />
    </Routes>
  );
}
