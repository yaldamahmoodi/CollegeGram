import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  createPost,
  likePost,
  type postDataType,
  unLikePost,
  getSavedPosts,
  getPostById,
  createComment,
} from "@/api/post/post.api";
import type { CreateLikePostPayload } from "@/types/post.ts";
import { savePost, unSavePost } from "@/api/post/post.api";
import type { CreateSavePostPayload } from "@/types/post.ts";

export const usePosts = () => {
  return useQuery<postDataType, Error>({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLikePostPayload) => {
      const response = await likePost(payload);
      if (response.status === 201) {
        const res = await unLikePost(payload);
        if (res.status !== 200) {
          throw new Error("Failed to unlike post");
        }
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        return { action: "unlike" };
      }
      if (response.status !== 200) {
        throw new Error("Failed to like post");
      }
      return { action: "like" };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSavePostPayload) => {
      try {
        const response = await savePost(payload);

        if (response.status === 200) {
          return { action: "save" };
        }
      } catch (err: any) {
        if (err.response?.status === 409) {
          const res = await unSavePost(payload);
          if (res.status !== 200) throw new Error("Failed to unsave post");
          return { action: "unsave" };
        }
        throw err;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useSavedPostList = () => {
  return useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
  });
};

export const useGetPostById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["postById", id],
    queryFn: () => getPostById(id!),
    enabled: !!id,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};