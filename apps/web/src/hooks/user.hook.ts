import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  register,
  getUserInfo,
  getFollowers,
  getFollowings,
  follow,
  unFollow,
  logout,
  getOtherUser,
  getCloseFriendList,
  getBlockList,
  addCloseFriend,
  removeCloseFriend,
  addUserBlockList,
  removeUserBlockList,
  searchUsers,
  acceptFollowRequest,
  rejectFollowRequest,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "@/api/user/user.api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useAuth } from "@hooks/useAuth";
import { toast } from "@/utils/toastManager";
import { getErrorMessageByCode } from "@/utils/errorHandler";
import type { AxiosError } from "axios";

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success("ثبت نام با موفقیت انجام شد!");
      navigate(ROUTES.LOGIN);
      console.log("Register Success:", data);
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
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
      toast.success("ورود موفقیت‌آمیز بود!");
      navigate(ROUTES.PROFILE);
      console.log("Login Success:", data);
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("Login Error:", error);
      navigate(ROUTES.LOGIN);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("با موفقیت از حساب خارج شدید!");
      queryClient.removeQueries({ queryKey: ["userInfo"] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    select: (response) => response.data,
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("UserInfo Error:", error);
    },
  });
};

export const useGetOtherUser = (username: string | null) => {
  return useQuery({
    queryKey: ["getOtherUser", username],
    queryFn: () => getOtherUser(username!),
    enabled: !!username,
  });
};

export const useFollowingList = (enabled: boolean) => {
  return useQuery({
    queryKey: ["followings"],
    queryFn: getFollowings,
    select: (response) => response.data,
    enabled,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const message = getErrorMessageByCode(error);
        toast.error(message);
        console.error("Followings Error:", error);
      }
    },
  });
};

export const useFollowersList = (enabled: boolean) => {
  return useQuery({
    queryKey: ["followers"],
    queryFn: getFollowers,
    select: (response) => response.data,
    enabled,
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useFollow = () => {
  return useMutation({
    mutationFn: follow,
    onSuccess: () => {
      toast.success("دنبال کردن با موفقیت انجام شد!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useUnFollow = () => {
  return useMutation({
    mutationFn: unFollow,
    onSuccess: () => {
      toast.success("لغو دنبال کردن با موفقیت انجام شد!");
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useAcceptFollowRequest = (username: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFollowRequest,
    onSuccess: () => {
      toast.success("درخواست دنبال کردن با موفقیت پذیرفته شد!");
      queryClient.invalidateQueries({ queryKey: ["getOtherUser", username] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useRejectFollowRequest = (username) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectFollowRequest,
    onSuccess: () => {
      toast.success("درخواست دنبال کردن با موفقیت پذیرفته شد!");
      queryClient.invalidateQueries({ queryKey: ["getOtherUser", username] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useCloseFiendList = () => {
  return useQuery({
    queryKey: ["closeFriendList"],
    queryFn: getCloseFriendList,
    select: (response) => response.data,
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useAddCloseFriend = () => {
  return useMutation({
    mutationFn: addCloseFriend,
    onSuccess: () => {
      toast.success("یک دوست نزدیک به دوستانت اضافه شد");
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useRemoveCloseFriend = () => {
  return useMutation({
    mutationFn: removeCloseFriend,
    onSuccess: () => {
      toast.success("یک دوست نزدیک از دوستانت حذف شد");
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

// ------------------ FORGOT PASSWORD ------------------
export const useForgotPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data, variables) => {
      toast.success("کد تایید به ایمیل شما ارسال شد!");
      navigate(ROUTES.VERIFY_OTP, { state: { email: variables.email } });
      console.log("Forgot Password Success:", data);
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("Forgot Password Error:", error);
    },
  });
};

// ------------------ VERIFY OTP ------------------
export const useVerifyOTP = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data, variables) => {
      console.log("Verify OTP Success - Full data:", data);
      console.log("Reset token:", data.resetToken);
      toast.success("کد تایید با موفقیت تأیید شد!");
      navigate(ROUTES.RESET_PASSWORD, { 
        state: { 
          email: variables.email, 
          resetToken: data.resetToken
        } 
      });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error("Verify OTP Error:", error);
    },
  });
};

// ------------------ RESET PASSWORD ------------------
export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      console.log("Reset Password Success:", data);
      toast.success("رمز عبور با موفقیت تغییر یافت!");
      navigate(ROUTES.LOGIN);
    },
    onError: (error: unknown) => {
      console.error("Reset Password Error - Full error:", error);
      console.error("Error response:", (error as AxiosError).response?.data ) ;
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useBlockList = () => {
  return useQuery({
    queryKey: ["blockList"],
    queryFn: getBlockList,
    select: (response) => response.data,
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useAddUserBlockList = () => {
  return useMutation({
    mutationFn: addUserBlockList,
    onSuccess: () => {
      toast.success("یک دوست به لیست سیاه اضافه شد");
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useRemoveUserBlockList = () => {
  return useMutation({
    mutationFn: removeUserBlockList,
    onSuccess: () => {
      toast.success("یک دوست از لیست سیاه حذف شد");
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useSearchUsers = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ["searchUsers", query, page],
    queryFn: () => searchUsers(query, page),
    enabled: !!query,
  });
};
