import api from "../axios";
import { USER_URLS } from "./urls";
import type { UserRegisterPayload, UserLoginPayload } from "@app-types/user";

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
