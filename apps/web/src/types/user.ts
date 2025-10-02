//Register

export interface UserRegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstname?: string;
  lastname?: string;
  biography?: string;
}

export type UserRegisterPayload = Omit<
  UserRegisterFormValues,
  "confirmPassword"
>;

//login
export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export type UserLoginPayload = Omit<LoginFormValues, "rememberMe">;

export interface UserInfoResponse
  extends Pick<
    UserRegisterPayload,
    "firstname" | "lastname" | "biography" | "username" | "email"
  > {
  follower_count: number;
  following_count: number;
  post_count: number;
  profilePhotoUrl: string;
}

export interface UserRelationType {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  follower_count: number;
  following_count: number;
  profilePhoto: string;
}

export type FollowersType = UserRelationType;
export type FollowingType = UserRelationType;

export interface followType {
  followedUserId: string;
}

export interface unfollowType {
  unfollowedUserId: string;
}

// Forgot Password Flow
export interface ForgotPasswordFormValues {
  email: string;
}

export interface VerifyOTPFormValues {
  email: string;
  otp: string;
}

export interface ResetPasswordFormValues {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export type ForgotPasswordPayload = ForgotPasswordFormValues;
export type VerifyOTPPayload = VerifyOTPFormValues;
export type ResetPasswordPayload = Omit<ResetPasswordFormValues, "confirmPassword">;