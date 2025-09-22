import ImageSlider from "@components/ImageSlider";
import { useState } from "react";
import noAvatarIcon from "@assets/images/username.png";
import LikeIcon from "@assets/icons/like.svg";
import commentIcon from "@assets/icons/comment.svg";
import saveIcon from "@assets/icons/savePost.svg";
import sendIcon from "@assets/icons/sendComment.svg";
import replayComment from "@assets/icons/replay.svg";

const PostDetail = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "مهران موسوی",
      text: "خیلی عالی بود 👌 فقط سوال دارم راجب بخشی که گفتید جامعه محصول نیرو است؟",
      likes: 2,
      liked: false,
    },
    {
      id: 2,
      name: "نگار رضایی",
      text: "بسیار زیبا 👏👏",
      likes: 1,
      liked: false,
    },
    {
      id: 3,
      name: "حامد محمدی",
      text: "خیلی خوب توضیح دادید، ممنونم 🙏",
      likes: 0,
      liked: false,
    },
  ]);
  const tags = ["شمس دهقان", "maryam"];
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const newC = {
      id: comments.length + 1,
      name: "کاربر من",
      text: newComment,
      likes: 0,
      liked: false,
    };
    setComments([newC, ...comments]);
    setNewComment("");
  };

  const toggleLike = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="w-full">
          <ImageSlider
            images={[
              "https://picsum.photos/400/400?random=1",
              "https://picsum.photos/400/400?random=2",
              "https://picsum.photos/400/400?random=3",
            ]}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={noAvatarIcon}
              alt="user"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-orange-500">شمن دهقان</p>
            </div>
          </div>

          <p className="text-xs text-gray-500">۱۲ مرداد</p>

          <p className="text-sm md:text-base leading-6 text-gray-700">
            درس بزرگی از <span className="font-bold">عوامل قُدرت</span> است، کسی
            که بتواند بر <span className="font-bold">جامعه</span> مسلط شود
            می‌تواند نیرویش کند. قدّرت نیرویی‌ست که با جامعه پیدا می‌شود. شاید
            بتوان حتی جامعه را محصول گسترش همین نیرو دانست، اما امروز…
          </p>

          <div className="flex flex-wrap gap-2 mb-6 mt-3">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs md:text-sm text-white rounded-md cursor-pointer bg-orange-500 hover:bg-orange-600">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-end items-center gap-6 text-gray-600 text-xs md:text-sm pb-3">
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-500">
              <img src={commentIcon} className="w-5 h-5" />
              <span className="text-red-500">{comments.length}</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-red-500">
              <img src={LikeIcon} className="w-5 h-5" />
              <span className="text-red-500">15</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-green-600">
              <img src={saveIcon} className="w-5 h-5" />
              <span className="text-red-500">298</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-3">
            <img
              src={noAvatarIcon}
              alt="me"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="نظر خود را بنویسید..."
              className="flex-1 border border-gray-300 bg-white rounded-full px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              className="text-orange-500 hover:text-orange-600">
              <img src={sendIcon} className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 pt-2 text-sm">
            {comments.map((c) => (
              <div key={c.id} className="pb-3 border-b last:border-none">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{c.name}</p>
                    <span className="text-xs text-gray-500">۱۲ مرداد</span>
                  </div>

                  <div className="flex gap-4 mt-2 sm:mt-0 text-red-500 items-center">
                    <button
                      className="flex gap-1 hover:opacity-80"
                      onClick={() => toggleLike(c.id)}>
                      <span>{c.likes}</span>
                      <img src={LikeIcon} className="w-4 h-4" />
                    </button>
                    <button className="flex gap-1 hover:opacity-80 text-gray-500">
                      <img src={replayComment} className="w-4 h-4" />
                      <span className="text-red-500">پاسخ</span>
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mt-1">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
