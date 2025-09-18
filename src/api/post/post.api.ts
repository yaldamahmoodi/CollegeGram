import api from "../axios";
import { POST_URLS } from "./urls";
import type { CreatePostPayload } from "@app-types/post";

export const getPosts = async () => {
  const { data } = await api.get(POST_URLS.POSTS_LIST);
  return data;
};

export const createPost = async (payload: CreatePostPayload) => {
  const { photos, caption, mentions } = payload;
  const formData = new FormData();

  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  if (caption) {
    formData.append("caption", caption);
  }

  if (mentions && mentions.length > 0) {
    formData.append("mentions", JSON.stringify(mentions));
  }

  const { data } = await api.post(POST_URLS.CREATE_POST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
