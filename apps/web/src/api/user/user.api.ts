import api from "../axios";
import { USER_URLS } from "./urls";
import type {
  UserRegisterPayload,
  UserLoginPayload,
  followType,
  unfollowType,
  ActionFriendType,
  SearchUsersResponse,
  ForgotPasswordPayload,
  VerifyOTPPayload,
  ResetPasswordPayload,
  SearchPostsResponse,
} from "@app-types/user";

export interface UpdateProfilePayload {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  biography?: string;
  isPrivate?: boolean;
}

export const register = async (payload: UserRegisterPayload) => {
  const { data } = await api.post(USER_URLS.REGISTER, payload);
  return data;
};

export const login = async (payload: UserLoginPayload) => {
  const { data } = await api.post(USER_URLS.LOGIN, payload);
  return data;
};

export const logout = async () => {
  const { data } = await api.post(USER_URLS.LOGOUT);
  return data;
};

export const getUserInfo = async () => {
  const { data } = await api.get(USER_URLS.USER_INFO);
  return data;
};

export const getOtherUser = async (username: string | null) => {
  const { data } = await api.get(`/users/${username}`);
  return data.data;
};

export const getFollowers = async () => {
  const { data } = await api.get(USER_URLS.FOLLOWERS_LIST);
  return data;
};

export const getFollowings = async () => {
  const { data } = await api.get(USER_URLS.FOLLOWINGS_LIST);
  return data;
};

export const follow = async (payload: followType) => {
  const { data } = await api.post(USER_URLS.FOLLOW, payload);
  return data;
};

export const unFollow = async (payload: unfollowType) => {
  const { data } = await api.post(USER_URLS.UNFOLLOW, payload);
  return data;
};

export const acceptFollowRequest = async (payload: {
  followerUserId: string;
}) => {
  const { data } = await api.post(USER_URLS.ACCEPT_FOLLOW_REQUEST, payload);
  return data;
};

export const rejectFollowRequest = async (payload: {
  followerUserId: string;
}) => {
  const { data } = await api.post(USER_URLS.REJECT_FOLLOW_REQUEST, payload);
  return data;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await api.patch(USER_URLS.UPDATE_PROFILE, payload);
  return data?.data ?? data;
};

export const uploadProfileImage = async (image: File) => {
  const formData = new FormData();
  formData.append("profile", image);

  const { data } = await api.post(USER_URLS.UPLOAD_PROFILE_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

    return data;
};

// Forgot Password Flow
export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await api.post(USER_URLS.FORGOT_PASSWORD, payload);
  return data;
};

export const verifyOTP = async (payload: VerifyOTPPayload) => {
  const { data } = await api.post(USER_URLS.VERIFY_OTP, payload);
  return data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post(USER_URLS.RESET_PASSWORD, payload);
  return data;
};

export const getCloseFriendList = async () => {
  const { data } = await api.get(USER_URLS.CLOSE_FRIEND_LIST);
  return data;
};

export const addCloseFriend = async (payload: ActionFriendType) => {
  const { data } = await api.post(USER_URLS.ADD_CLOSE_FRIEND, payload);
  return data;
};

export const removeCloseFriend = async (payload: ActionFriendType) => {
  const { data } = await api.post(USER_URLS.REMOVE_CLOSE_FRIEND, payload);
  return data;
};

export const getBlockList = async () => {
  const { data } = await api.get(USER_URLS.BLOCK_LIST);
  return data;
};

export const addUserBlockList = async (payload: ActionFriendType) => {
  const { data } = await api.post(USER_URLS.ADD_BLOCK_LIST, payload);
  return data;
};

export const removeUserBlockList = async (payload: ActionFriendType) => {
  const { data } = await api.post(USER_URLS.REMOVE_BLOCK_LIST, payload);
  return data;
};

export const searchUsers = async (
  query: string,
  page: number = 1
): Promise<SearchUsersResponse> => {
  const { data } = await api.get<SearchUsersResponse>(
    `${USER_URLS.SEARCH_USER}/${page}/${query}`,
    { withCredentials: true }
  );
  return data;
};


export const searchPosts = async (
  query: string,
  page: number = 1
): Promise<SearchPostsResponse> => {
  const { data } = await api.get<SearchPostsResponse>(
    `${USER_URLS.SEARCH_USER}/${page}/${query}`,
    { withCredentials: true }
  );
  return data;
};
