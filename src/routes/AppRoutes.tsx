import AuthLayout from "@/layouts/AuthLayout";
import ProfileLayout from "@/layouts/ProfileLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route index element={<Navigate to="login" />} />
      </Route>
      <Route path="/dashboard" element={<ProfileLayout />}>
        <Route index element={<Profile />} />
      </Route>
    </Routes>
  );
}
