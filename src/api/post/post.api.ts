import api from "../axios";
import { POST_URLS } from "./urls";
import type { CreatePostPayload } from "@app-types/post";

export const getPosts = async () => {
  const { data } = await api.get(POST_URLS.USER_POSTS);
  return data;
};

export const createPost = async (payload: CreatePostPayload) => {
  const { photos, caption } = payload;
  const formData = new FormData();
  photos.forEach((photo) => {
    formData.append("photos", photo);
  });
  if (caption) {
    formData.append("caption", caption);
  }
  const { data } = await api.post(POST_URLS.CREATE_POST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getSavedPosts = async () => {
  const { data } = await api.get(POST_URLS.SAVED_POST_LIST);
  return data;
};
