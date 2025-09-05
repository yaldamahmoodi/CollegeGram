import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/post/post.api";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
};
