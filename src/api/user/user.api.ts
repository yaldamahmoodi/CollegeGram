import api from "../axios";
import { USER_URLS } from "./urls";
import type { UserRegisterPayload, UserLoginPayload } from "@app-types/user";

export interface UpdateProfilePayload {
    email?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    biography?: string;
}


export const register = async (payload: UserRegisterPayload) => {
  const { data } = await api.post(USER_URLS.REGISTER, payload);
  return data;
};

export const login = async (payload: UserLoginPayload) => {
  const { data } = await api.post(USER_URLS.LOGIN, payload);
  return data;
};

export const getUserInfo = async () => {
  const { data } = await api.get(USER_URLS.USER_INFO);
  return data;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
    const { data } = await api.patch(USER_URLS.UPDATE_PROFILE, payload);
    return data?.data ?? data;
};


export const uploadProfileImage = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    const { data } = await api.post(USER_URLS.UPLOAD_PROFILE_IMAGE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
};

