export interface OtherUserType {
  userId: string;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  biography?: string;
  follower_count: number;
  following_count: number;
  post_count: number;
  profilePhotoUrl?: string;
  isFollowed: boolean;
  followStatus?: "accepted" | "pending" | "rejected";
  followedAt?: string;
  isBlocked: boolean;
  hasBlocked: boolean;
  isCloseFriend: boolean;
}

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

export interface actionFollowType {
    followerUserId: string;
}

export type followType = actionFollowType;

export interface unfollowType {
  followerUserId: string;
}

export interface FriendInfo {
  _id: string;
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  profilePhoto?: string;
  followerCount: number;
}

interface FriendRelation {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  friend_info: FriendInfo;
}

export type CloseFriend = FriendRelation;
export type BlockList = FriendRelation;
export type UpdateProfileType = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  isPrivate: boolean;
};

export interface ActionFriendType {
  friendId: string;
}

export interface ActionBlockType {
  blockUserId: string;
}

export interface SearchUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  profilePhotoPath: string;
  follower_count: number;
}

export interface SearchUsersResponse {
  totalCount: number;
  page: number;
  perPage: number;
  users: SearchUser[];
}

export interface SearchPostMention {
  user_id: string;
  username: string;
}

export interface SearchPost {
  id: string;
  user_id: string;
  urls: string[];
  caption?: string;
  photo_length: number;
  like_count: number;
  save_count: number;
  mentions: SearchPostMention[];
  hashtag_array: string[];
}

export interface SearchPostsResponse {
  totalCount: number;
  page: number;
  perPage: number;
  posts: SearchPost[];
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
export type ResetPasswordPayload = Omit<
  ResetPasswordFormValues,
  "confirmPassword"
>;
