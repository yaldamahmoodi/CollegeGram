import api from "../axios";
import type { AxiosResponse } from "axios";
import { POST_URLS } from "./urls";
import type {
  CreatePostPayload,
  Posts,
  PostInfo,
  CreateCommentResponseType,
  CreateCommentPayloadType,
  GetCommentsResponse,
  ActionCommentType,
  PostActionPayloadType,
  GetPostsPayload,
} from "@app-types/post";

export interface postData {
  _id: string;
  user_id: string;
  urls: string[];
  caption: string;
  like_count: number;
  save_count: number;
  mentions: string[];
  hashtag_array: string[];
  photo_length: number;
  createdAt: string;
}

export const getPosts = async (payload: GetPostsPayload) => {
  const { data } = await api.get(POST_URLS.POSTS_LIST, payload);
  return data;
};

export const getPostById = async (id: string | null): Promise<PostInfo> => {
  const { data } = await api.get(`/posts/${id}/getPost`);
  return data.data;
};

export const createPost = async (payload: CreatePostPayload) => {
  const { photos, caption, mentions, isClose } = payload;
  const formData = new FormData();
  photos.forEach((photo) => {
    formData.append("photos", photo);
  });
  if (caption) {
    formData.append("caption", caption);
  }
  if (typeof isClose === "boolean") {
    formData.append("isClose", String(isClose));
  }

  if (mentions?.length) {
    formData.append("mentions", JSON.stringify(mentions));
  }
  const { data } = await api.post(POST_URLS.CREATE_POST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const likePost = async (payload: PostActionPayloadType) => {
  return await api.post(POST_URLS.LIKE_POST, payload);
};

export const unLikePost = async (payload: PostActionPayloadType) => {
  const { postId } = payload;
  return await api.post(`/posts/${postId}/unlike`);
};

export const savePost = async (payload: PostActionPayloadType) => {
  return await api.post(POST_URLS.SAVE_POST, payload);
};

export const unSavePost = async (payload: PostActionPayloadType) => {
  const { postId } = payload;
  return await api.post(`/posts/${postId}/unsave`);
};

export const getSavedPosts = async () => {
  const { data } = await api.get(POST_URLS.SAVED_POST_LIST);
  return data;
};

export const getExplorePosts = async (page = 1, pageSize = 10) => {
  const { data } = await api.get("/posts/explore", {
    params: { page, pageSize },
  });
};

export const getTaggedPosts = async () => {
  const { data } = await api.get(POST_URLS.TAGGED_POST_LIST);
  return data;
};

export const createComment = async (
  payload: CreateCommentPayloadType
): Promise<CreateCommentResponseType> => {
  const { data } = await api.post(POST_URLS.CREATE_COMMENT, payload);
  return data;
};

export const getPostComments = async (
  postId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<GetCommentsResponse> => {
  const { data }: AxiosResponse<GetCommentsResponse> = await api.get(
    POST_URLS.COMMENT_LIST,
    {
      params: { postId, page, pageSize },
    }
  );
  return data;
};

export const likeComment = async (payload: ActionCommentType) => {
  const { data } = await api.post(POST_URLS.LIKE_COMMENT, payload);
  return data;
};

export const unlikeComment = async (payload: ActionCommentType) => {
  const { data } = await api.post(POST_URLS.UNLIKE_COMMENT, payload);
  return data;
};
