import api from "../axios";
import { POST_URLS } from "./urls";

export const getPosts = async () => {
  const { data } = await api.get(POST_URLS.USER_POSTS);
  return data;
};
