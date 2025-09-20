import Button from "@components/Button";
import { useEffect, useState } from "react";
import PostDetailsModal from "@/layouts/ProfileLayout/components/PostDetailsModal.tsx";

import { usePosts } from "@hooks/post.hook.ts";
import type { postData } from "@api/post/post.api.ts";

interface UserPostsProps {
  onChangeModal: () => void;
}

const UserPosts = (props: UserPostsProps) => {
  const { onChangeModal } = props;
  const { data = [] } = usePosts();
  const [selectedPost, setSelectedPost] = useState<postData | null>(null);
  useEffect(() => {
    if (selectedPost && data) {
      const updated = data.find((p) => p._id === selectedPost._id);
      if (updated) {
        setSelectedPost(updated);
      }
    }
  }, [data, selectedPost]);
  return (
    <div className="profile-posts w-full h-full flex-auto border border-gray-400 p-4 overflow-y-auto rounded-4xl">
      {data.length > 0 ? (
        <div className="flex flex-wrap gap-10 justify-evenly">
          {data.map((item) => (
            <img
              key={item._id}
              src={item.urls[0] || ""}
              className="w-80 h-80 rounded-2xl cursor-pointer"
              onClick={() => setSelectedPost(item)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
          <span>هنوز هیچ پستی توی صفحه ات نذاشتی!</span>
          <span>بجنب تا دیر نشده</span>
          <Button
            type="button"
            label="+ ایجاد پست جدید"
            variant="danger"
            className="text-basis py-1 text-xs rounded-4xl w-[197px] h-[52px] mt-5"
            onClick={onChangeModal}
          />
        </div>
      )}

      {selectedPost && (
        <PostDetailsModal
          isOpen={!!selectedPost}
          close={() => setSelectedPost(null)}
          data={selectedPost}
        />
      )}
    </div>
  );
};

export default UserPosts;
