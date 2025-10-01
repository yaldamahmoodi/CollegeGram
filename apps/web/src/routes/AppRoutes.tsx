import AuthLayout from "@/layouts/AuthLayout";
import ProfileLayout from "@/layouts/ProfileLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/Login";
import Profile from "@pages/Profile";
import Register from "@pages/Register";
import NotFound from "@pages/NotFound";
import Explore from "@/pages/explore/Explore";
import SavedPosts from "@/pages/SavedPosts";
import Notifications from "@/pages/notifications/Notifications";
import ProtectedRoute from "./ProtectedRoute";
import TaggedPosts from "@/pages/TaggedPosts";

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
        <Route path={ROUTES.PROFILE} element={<ProfileLayout />}>
          <Route index element={<Profile />} />
          <Route path={ROUTES.TAGGED_POSTS} element={<TaggedPosts />} />
          <Route path={ROUTES.SAVED_POSTS} element={<SavedPosts />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
          {/* <Route path={ROUTES.POST_DETAIL} element={<PostDetail  />} /> */}
          <Route path={ROUTES.EXPLORE} element={<Explore />} />
        </Route>
      </Route>

      <Route path={ROUTES.CATCH_ALL} element={<NotFound />} />
    </Routes>
  );
}
