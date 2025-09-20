import { useState } from "react";
import ImageSlider from "@components/Image.tsx";
import avatar from "@assets/images/avatar.png";
import Button from "@components/Button.tsx";
import like from "@assets/icons/like.svg";
import save from "@assets/icons/save.svg";
import comment from "@assets/icons/comment.svg";
import { useNavigate } from "react-router-dom";
import { useLikePost, useSavePost } from "@hooks/post.hook.ts";

interface postData {
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

interface PostDetailProps {
  data: postData;
}

const PostDetail = ({ data }: PostDetailProps) => {
  const created = Date.parse(data?.createdAt || new Date().toISOString());
  if (Number.isNaN(created)) throw new Error("Invalid createdAt");

  const diffMs = Math.max(0, Date.now() - created);

  // handy units
  //     const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffMs / 60000);
  // const diffHr = Math.floor(diffMs / 3600000);
  // const diffDay = Math.floor(diffMs / 86400000);

  const [comentsCount] = useState(12);

  const likeMutation = useLikePost();
  const handleLike = async () => {
    likeMutation.mutate({ postId: data._id });
  };

  const saveMutation = useSavePost();
  const handleSave = async () => {
    saveMutation.mutate({ postId: data._id }); // payload فقط برای savePost استفاده میشه
  };

  const navigate = useNavigate();

  const handleCommentClick = () => {
    navigate("/post");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-14 pt-12">
        <div className="flex-1">
          <ImageSlider images={data?.urls} />
        </div>

        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-2xl font-bold text-right">mhmz</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs">{diffMin} دقیقه پیش</span>
            <p className="text-gray-700 text-right leading-relaxed">
              {data?.caption}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Button
              type="button"
              onClick={handleCommentClick}
              icon={<img src={comment} />}
              label={String(comentsCount)}
              className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
            />

            <Button
              type="button"
              onClick={handleLike}
              label={data?.like_count.toString()}
              icon={<img src={like} />}
              className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
            />

            <Button
              type="button"
              onClick={handleSave}
              icon={<img src={save} />}
              label={data?.save_count.toString()}
              className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
