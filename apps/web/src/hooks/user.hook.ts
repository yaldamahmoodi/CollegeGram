import { useMutation, useQuery } from "@tanstack/react-query";
import {
  login,
  register,
  getUserInfo,
  getFollowers,
  getFollowings,
  follow,
  unFollow,
  forgotPassword,
  verifyOTP,
  resetPassword,
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
    onError: (error: unknown) => {
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
    onError: (error: unknown) => {
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
    onError: (error: unknown) => {
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
    onError: (error: unknown) => {
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
    onError: (error: unknown) => {
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
    onError: (error: unknown) => {
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
          resetToken: data.resetToken // Use resetToken instead of otp
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
      console.error("Error response:", error.response?.data);
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};
