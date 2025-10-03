import Button from "@components/Button";
import { useEffect, useState } from "react";
import PostDetailsModal from "@/pages/profile/components/PostDetailsModal";
import { usePosts } from "@hooks/post.hook.ts";
import type { PostInfo } from "@/types/post";
import ImageGroup from "@components/ImageGroup.tsx";
import { MESSAGES } from "@/const/message.ts";
import type { OtherUserType } from "@/types/user";

interface UserPostsProps {
  onChangeModal: () => void;
  otherUser: OtherUserType | null;
}

const UserPosts = ({ otherUser, onChangeModal }: UserPostsProps) => {
  const userId = otherUser?.userId;

  const { data: otherUserPosts } = usePosts(userId);
  const { data: posts } = usePosts();

  const postList: PostInfo[] | undefined = otherUser ? otherUserPosts : posts;
  console.log(postList);
  const [selectedPost, setSelectedPost] = useState<PostInfo | null>(null);

  useEffect(() => {
    if (selectedPost && postList) {
      const updated = postList.find((post) => post._id === selectedPost._id);
      if (updated) {
        setSelectedPost(updated);
      }
    }
  }, [postList, selectedPost]);

  return (
    <div className="profile-posts w-full h-full flex-auto border border-gray-400 p-4 overflow-y-auto rounded-2xl">
      {Array.isArray(postList) && postList.length > 0 ? (
        <div className="grid grid-cols-12 gap-6">
          {postList?.map((item) => (
            <div
              key={item._id}
              className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <ImageGroup
                urls={item.urls}
                onClick={() => setSelectedPost(item)}
                showIcon={!selectedPost}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
          <span>{MESSAGES.userNotPosts}</span>
          <span>{MESSAGES.userNotPostsParagraph}</span>

          {!otherUser && (
            <Button
              type="button"
              label="+ ایجاد پست جدید"
              variant="danger"
              className="text-basis py-1 text-xs rounded-2xl w-[197px] h-[52px] mt-5"
              onClick={onChangeModal}
            />
          )}
        </div>
      )}

      {selectedPost && (
        <PostDetailsModal
          isOpen={true}
          close={() => setSelectedPost(null)}
          data={selectedPost}
        />
      )}
    </div>
  );
};

export default UserPosts;
