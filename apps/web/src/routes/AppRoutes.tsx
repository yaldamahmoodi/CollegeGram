
import AuthLayout from "@/layouts/AuthLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/Login";
import Profile from "@/pages/profile/Profile";
import Register from "@pages/Register";
import NotFound from "@pages/NotFound";
import Search from "@/pages/search/Search";
import SavedPosts from "@/pages/SavedPosts";
import Notifications from "@/pages/notifications/Notifications";
import ProtectedRoute from "./ProtectedRoute";
import TaggedPosts from "@/pages/TaggedPosts";
import PostDetail from "@/pages/PostDetail";
import { ROUTES } from "./routes";
import { useAxiosInterceptor } from "@api/axios";
import Explore from "@/pages/search/Search";
import ProfileLayout from "@/layouts/ProfileLayout";

export default function AppRoutes() {
  useAxiosInterceptor();

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
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.SAVED_POSTS} element={<SavedPosts />} />
        <Route path={ROUTES.TAGGED_POSTS} element={<TaggedPosts />} />
        <Route path={ROUTES.POST_DETAIL} element={<PostDetail />} />
        <Route path={ROUTES.SEARCH} element={<Search />} />
      </Route>

      <Route path={ROUTES.CATCH_ALL} element={<NotFound />} />
    </Routes>
  );
}
