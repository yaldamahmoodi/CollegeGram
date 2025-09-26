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

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      console.log("Register Success:", data);
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error("Register Error:", error);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.accessToken);
      localStorage.setItem("userId", data.userId);
      navigate(ROUTES.PROFILE);
      console.log("Login Success:", data);
    },
    onError: (error) => {
      console.error("Login Error:", error);
      navigate(ROUTES.LOGIN);
    },
  });
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    select: (response) => response.data,
  });
};

export const useFollowingList = () => {
  return useQuery({
    queryKey: ["followings"],
    queryFn: getFollowings,
    select: (response) => response.data,
  });
};

export const useFollowersList = () => {
  return useQuery({
    queryKey: ["followers"],
    queryFn: getFollowers,
    select: (response) => response.data,
  });
};

export const useFollow = () => {
  return useMutation({
    mutationFn: follow,
  });
};

export const useUnFollow = () => {
  return useMutation({
    mutationFn: unFollow,
  });
};
