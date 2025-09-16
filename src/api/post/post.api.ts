import api from "../axios";
import { POST_URLS } from "./urls";
import type { CreatePostPayload } from "@app-types/post";

export const getPosts = async (userId: string = "" , page: number = 1 , pageSize: number = 10) => { 
  const { data } = await api.get(`/posts/getPosts?page=${page}&pageSize=${pageSize}${userId ? "&id=" + userId : ""} `);
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
