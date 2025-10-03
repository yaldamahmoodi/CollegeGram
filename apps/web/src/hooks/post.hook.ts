import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  createPost,
  likePost,
  type postDataType,
  unLikePost,
  getSavedPosts,
  getExplorePosts,
  getPostById,
  createComment,
  getTaggedPosts,
  getPostComments,
  likeComment,
  unlikeComment,
} from "@/api/post/post.api";

import { savePost, unSavePost } from "@/api/post/post.api";
import { toast } from "@/utils/toastManager";
import { getErrorMessageByCode } from "@/utils/errorHandler";

export const usePosts = (userId?: string, page = 1, pageSize = 10) => {
  console.log(userId);
  return useQuery({
    queryKey: ["posts", userId, page, pageSize],
    queryFn: () => getPosts({ userId, page, pageSize }),
    select: (response) => response.data,
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
    mutationFn: likePost,
    onSuccess: (_, variables) => {
      const postId = variables.postId;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (postId)
        queryClient.invalidateQueries({ queryKey: ["postById", postId] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error(error);
    },
  });
};

export const useUnLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unLikePost,
    onSuccess: (_, variables) => {
      const postId = variables.postId;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (postId)
        queryClient.invalidateQueries({ queryKey: ["postById", postId] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error(error);
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savePost,
    onSuccess: (_, variables) => {
      const postId = variables.postId;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (postId)
        queryClient.invalidateQueries({ queryKey: ["postById", postId] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error(error);
    },
  });
};

export const useUnSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unSavePost,
    onSuccess: (_, variables) => {
      const postId = variables.postId;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (postId)
        queryClient.invalidateQueries({ queryKey: ["postById", postId] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
      console.error(error);
    },
  });
};

export const useSavedPostList = () => {
  return useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
  });
};

export const useExplorePosts = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["explorePosts", page, pageSize],
    queryFn: () => getExplorePosts(page, pageSize),
  });
};
export const useTaggedPostList = () => {
  return useQuery({
    queryKey: ["taggedPosts"],
    queryFn: getTaggedPosts,
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

export const usePostComments = (
  postId: string,
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ["comments", postId, page, pageSize],
    queryFn: () => getPostComments(postId, page, pageSize),
    select: (response) => response.data,
    enabled: !!postId,
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};

export const useUnLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlikeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessageByCode(error);
      toast.error(message);
    },
  });
};
