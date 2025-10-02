
import AuthLayout from "@/layouts/AuthLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/Login";
import Profile from "@/pages/profile/Profile";
import Register from "@pages/Register";
import NotFound from "@pages/NotFound";
import Search from "@/pages/search/Search";
import SavedPosts from "@/pages/SavedPosts";
import ProtectedRoute from "./ProtectedRoute";
import TaggedPosts from "@/pages/TaggedPosts";
import PostDetail from "@/pages/PostDetail";
import { ROUTES } from "./routes";
import { useAxiosInterceptor } from "@api/axios";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyOTP from "@/pages/VerifyOTP";
import ResetPassword from "@/pages/ResetPassword";
import Explore from "@/pages/search/Search";
import Notifications from "@/pages/notifications";

export default function AppRoutes() {
  useAxiosInterceptor();

  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.VERIFY_OTP} element={<VerifyOTP />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route index element={<Navigate to={ROUTES.LOGIN} />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.SAVED_POSTS} element={<SavedPosts />} />
        <Route path={ROUTES.TAGGED_POSTS} element={<TaggedPosts />} />
        <Route path={ROUTES.POST_DETAIL} element={<PostDetail />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
        <Route path={ROUTES.SEARCH} element={<Search />} />
        <Route path={ROUTES.EXPLORE} element={<Explore/>} />
      </Route>

      <Route path={ROUTES.CATCH_ALL} element={<NotFound />} />
    </Routes>
  );
}
