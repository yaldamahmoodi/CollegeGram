import { useMutation, useQuery } from "@tanstack/react-query";
import { login, register, getUserInfo } from "@/api/user/user.api";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      console.log("Register Success:", data);
    },
    onError: (error) => {
      console.error("Register Error:", error);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("userId", data.userId);
      navigate("/dashboard"); //
      console.log("Login Success:", data);
    },
    onError: (error) => {
      console.error("Login Error:", error);
      navigate("/login");
    },
  });
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });
};
