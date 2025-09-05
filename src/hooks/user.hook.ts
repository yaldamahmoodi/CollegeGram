import { useMutation, useQuery } from "@tanstack/react-query";
import { login, register, getUserInfo } from "@/api/user/user.api";

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
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      console.log("Login Success:", data);
    },
    onError: (error) => {
      console.error("Login Error:", error);
    },
  });
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });
};
