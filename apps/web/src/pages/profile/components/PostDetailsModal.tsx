import { useState, useMemo } from "react";
import ImageSlider from "@/components/ImageSlider";
import Modal from "@components/Modal.tsx";
import Button from "@components/Button.tsx";
import unLikeIcon from "@assets/icons/like.svg";
import unSaveIcon from "@assets/icons/savePost.svg";
import comment from "@assets/icons/comment.svg";
import savedIcon from "@assets/icons/saved.svg";
import likedIcon from "@assets/icons/liked.svg";
import { Link, useNavigate } from "react-router-dom";
import { Expand, XCircle } from "lucide-react";
import profilePhoto from "@assets/images/username.png";
import { useUserInfo } from "@hooks/user.hook.ts";
import {
  useLikePost,
  useSavePost,
  useUnLikePost,
  useUnSavePost,
} from "@hooks/post.hook.ts";
import type { PostInfo, PostActionPayloadType } from "@/types/post";
<<<<<<< Updated upstream
=======
import type { OtherUserType } from "@/types/user";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
>>>>>>> Stashed changes

interface PostDetailsModalProps {
  isOpen: boolean;
  close: () => void;
  data: PostInfo;
}

const Caption = ({ text }: { text: string }) => {
  const parts = useMemo(
    () =>
      text?.split(/(\s+)/).map((p, i) =>
        /^#[^\s#]+$/.test(p) ? (
          <strong key={i} className="font-bold text-black">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      ),
    [text]
  );
  return (
    <p className="text-gray-700 text-right leading-relaxed break-words whitespace-pre-wrap">
      {parts}
    </p>
  );
};

<<<<<<< Updated upstream
// تبدیل mentions به string[]
const Mentions = ({ items }: { items?: {username: string; user_id: string}[] }) => {
=======
const Mentions = ({ items }: { items?: string[] }) => {
>>>>>>> Stashed changes
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {items.map((m, i) => (
        <Link to={`/user/${m.username}`}
          key={`${m}-${i}`}
          className="px-2 py-1 rounded-full bg-orange-500 text-white text-xs leading-none"
          dir="rtl">
          @{m.username}
        </Link>
      ))}
    </div>
  );
};

const PostDetailsModal = ({ isOpen, close, data }: PostDetailsModalProps) => {
<<<<<<< Updated upstream
  const created = Date.parse(((data as unknown) as { createdAt?: string }).createdAt || new Date().toISOString());
  if (Number.isNaN(created)) throw new Error("Invalid createdAt");
  const diffMs = Math.max(0, Date.now() - created);
  const diffMin = Math.floor(diffMs / 60000);
  const [comentsCount] = useState(12);

=======
>>>>>>> Stashed changes
  const likePostMutation = useLikePost();
  const unLikePostMutation = useUnLikePost();
  const savePostMutation = useSavePost();
  const unSavePostMutation = useUnSavePost();

  const handleLikeToggle = () => {
    const payload: PostActionPayloadType = { postId: data?._id };
    if (data?.isLiked) {
      unLikePostMutation.mutate(payload);
    } else {
      likePostMutation.mutate(payload);
    }
  };

  const handleSaveToggle = () => {
    const payload: PostActionPayloadType = { postId: data?._id };
    if (data?.isSaved) {
      unSavePostMutation.mutate(payload);
    } else {
      savePostMutation.mutate(payload);
    }
  };

  const navigate = useNavigate();
  const handleCommentClick = () => navigate(`/postDetail/${data?._id}`);

<<<<<<< Updated upstream
  // مشخص کردن تایپ user
  const { data: user } = useUserInfo();
=======
  const { data: user } = useUserInfo<OtherUserType>();
>>>>>>> Stashed changes

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      size="xLarge"
      className="max-w-[95vw] xl:max-w-[1100px] 2xl:max-w-[1280px]">
      <div className="max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <Expand
            className="text-red-500 cursor-pointer"
            onClick={() => navigate(`/postDetail/${data?._id}`)}
          />
          <XCircle onClick={close} className="text-red-500 cursor-pointer" />
        </div>

        <div
          className="
            grid gap-6 px-4 pb-6
            grid-cols-1
            lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]
            xl:grid-cols-[minmax(0,1.2fr)_minmax(420px,1fr)]
            2xl:grid-cols-[minmax(0,1.3fr)_minmax(480px,1fr)]
          ">
          <div className="min-w-0">
            <div className="relative w-full">
              <div className="w-full max-h-[65vh] lg:max-h-[60vh] xl:max-h-[58vh] 2xl:max-h-[55vh] overflow-hidden">
                <ImageSlider images={data?.urls} />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex flex-col gap-6 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={user?.profilePhotoUrl || profilePhoto}
                  alt="avatar"
                  className="w-10 h-10 rounded-full shrink-0"
                />
                <span className="text-xl font-bold truncate text-right">
                  {user?.username || ""}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-0">
              <span className="text-xs text-gray-500">
                {formatRelativeTime(data?.createdAt)}
              </span>

              <div className="max-h-[40vh] overflow-auto pr-1">
                <Caption text={data?.caption} />
              </div>

              <Mentions
                items={Array.isArray(data?.mentions) ? data?.mentions : []}
              />
            </div>

            <div className="flex justify-end items-center gap-6">
              <Button
                type="button"
                onClick={handleCommentClick}
                icon={<img src={comment} />}
                label={data?.comment_count?.toString() || "0"}
                className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                style={{
                  minWidth: "auto",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              />
              <Button
                type="button"
                onClick={handleLikeToggle}
                label={data?.like_count?.toString() || "0"}
                icon={<img src={data?.isLiked ? likedIcon : unLikeIcon} />}
                className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                style={{
                  minWidth: "auto",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              />
              <Button
                type="button"
                onClick={handleSaveToggle}
                icon={<img src={data?.isSaved ? savedIcon : unSaveIcon} />}
                label={data?.save_count?.toString() || "0"}
                className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                style={{
                  minWidth: "auto",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailsModal;
