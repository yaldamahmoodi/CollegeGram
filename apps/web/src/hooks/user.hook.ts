import { useMutation, useQuery } from "@tanstack/react-query";
import {
  login,
  register,
  getUserInfo,
  getFollowers,
  getFollowings,
  follow,
  unFollow,
} from "@/api/user/user.api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useAuth } from "@hooks/useAuth";
import { toast } from "@/utils/toastManager";
import { getErrorMessageByCode } from "@/utils/errorHandler";

// ------------------ REGISTER ------------------
export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success("ثبت نام با موفقیت انجام شد!");
      navigate(ROUTES.LOGIN);
      console.log("Register Success:", data);
    },
    onError: (error: any) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("Register Error:", error);
    },
  });
};

// ------------------ LOGIN ------------------
export const useLogin = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.accessToken);
      localStorage.setItem("userId", data.userId);
      toast.success("ورود موفقیت‌آمیز بود!");
      navigate(ROUTES.PROFILE);
      console.log("Login Success:", data);
    },
    onError: (error: any) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("Login Error:", error);
      navigate(ROUTES.LOGIN);
    },
  });
};

// ------------------ USER INFO ------------------
export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    select: (response) => response.data,
    onError: (error: any) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("UserInfo Error:", error);
    },
  });
};

// ------------------ FOLLOWINGS ------------------
export const useFollowingList = () => {
  return useQuery({
    queryKey: ["followings"],
    queryFn: getFollowings,
    select: (response) => response.data,
    onError: (error: any) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("Followings Error:", error);
    },
  });
};

// ------------------ FOLLOWERS ------------------
export const useFollowersList = () => {
  return useQuery({
    queryKey: ["followers"],
    queryFn: getFollowers,
    select: (response) => response.data,
    onError: (error: any) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("Followers Error:", error);
    },
  });
};

// ------------------ FOLLOW ------------------
export const useFollow = () => {
  return useMutation({
    mutationFn: follow,
    onSuccess: () => {
      toast.success("دنبال کردن با موفقیت انجام شد!");
    },
    onError: (error: any) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

// ------------------ UNFOLLOW ------------------
export const useUnFollow = () => {
  return useMutation({
    mutationFn: unFollow,
    onSuccess: () => {
      toast.success("لغو دنبال کردن با موفقیت انجام شد!");
    },
    onError: (error: any) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};
