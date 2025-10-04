import DefaultAvatar from "@assets/images/username.png";
import Button from "@components/Button";
import unLikedIcon from "@assets/icons/likes-black.svg";
import unSavedIcon from "@assets/icons/save-black.svg";
import savedIcon from "@assets/icons/saved.svg";
import likedIcon from "@assets/icons/liked.svg";
import commentIcon from "@assets/icons/comment-black.svg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import type { ExplorePostType, PostActionPayloadType } from "@/types/post";
import {
  useLikePost,
  useSavePost,
  useUnLikePost,
  useUnSavePost,
} from "@/hooks/post.hook";

interface PostCardProps {
  post: ExplorePostType;
}

const PostCard = (props: PostCardProps) => {
  const { post } = props;

  const navigate = useNavigate();

  const { mutate: like } = useLikePost();
  const { mutate: unLike } = useUnLikePost();
  const { mutate: save } = useSavePost();
  const { mutate: unSave } = useUnSavePost();

  const handleLikeToggle = (id: string) => {
    const payload: PostActionPayloadType = { postId: id! };
    if (post?.isLiked) unLike(payload);
    else like(payload);
  };

  const handleSaveToggle = (id: string) => {
    const payload: PostActionPayloadType = { postId: id! };
    if (post?.isSaved) unSave(payload);
    else save(payload);
  };

  return (
    <div className="flex flex-col border rounded-3xl overflow-hidden bg-white border-gray-300">
      <div
        onClick={() => navigate(`/postDetail/${post?._id}`)}
        className="w-full cursor-pointer group relative"
        role="button"
        aria-label="open post">
        <img
          src={post?.urls}
          alt="post"
          className="w-full h-[260px] object-cover transition-transform duration-200 group-hover:scale-[1.01]"
          loading="lazy"
        />
      </div>

      <div className="flex items-center gap-6 pt-1 border-t border-gray-200 px-3">
        <Button
          type="button"
          onClick={() => navigate(`/postDetail/${post?._id}`)}
          icon={<img src={commentIcon} />}
          label={String(post.comment_count || "0")}
          className="flex flex-row gap-2  items-center bg-transparent hover:bg-transparent !text-black"
          style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
        />
        <Button
          type="button"
          onClick={() => handleLikeToggle(post?.post_id)}
          icon={<img src={post?.isLiked ? likedIcon : unLikedIcon} />}
          label={String(post?.like_count || "0")}
          className={`flex flex-row gap-2  items-center bg-transparent hover:bg-transparent !text-black ${
            post?.isLiked ? "!text-black" : ""
          }`}
          style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
        />
        <Button
          type="button"
          onClick={() => handleSaveToggle(post?.post_id)}
          icon={<img src={post?.isSaved ? savedIcon : unSavedIcon} />}
          label={String(post?.save_count || "0")}
          className={`flex flex-row gap-2 items-center bg-transparent hover:bg-transparent !text-black ${
            post?.isSaved ? "!text-black" : ""
          }`}
          style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
        />
      </div>

      <div className="flex flex-col p-4 gap-3">
        <div
          className="flex items-center gap-2"
          onClick={() => navigate(`user/${post?.username}`)}>
          <img
            src={post?.profilePhotoUrl || DefaultAvatar}
            alt={post?.firstname}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {post?.firstname || ""} {post?.lastname || ""}
            </span>
            <span className="font-normal text-xs text-gray-500">
              {post?.following_count} دنبال‌کننده‌
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
