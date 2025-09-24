import { useState, useMemo } from "react";
import ImageSlider from "@/components/ImageSlider";
import Modal from "@components/Modal.tsx";
import avatar from "@assets/images/avatar.png";
import Button from "@components/Button.tsx";
import edit from "@assets/icons/edit.svg";
import like from "@assets/icons/like.svg";
import savePost from "@assets/icons/savePost.svg";
import comment from "@assets/icons/comment.svg";
import { useNavigate } from "react-router-dom";
import { Expand, XCircle } from "lucide-react";
import { useLikePost, useSavePost } from "@hooks/post.hook.ts";
import { ROUTES } from "@/routes/routes";

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

interface PostDetailsModalProps {
    isOpen: boolean;
    close: () => void;
    data: postData;
}

const Caption = ({ text }: { text: string }) => {
    const parts = useMemo(
        () =>
            text.split(/(\s+)/).map((p, i) =>
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

const Mentions = ({ items }: { items?: string[] }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 justify-end">
            {items.map((m, i) => (
                <span
                    key={`${m}-${i}`}
                    className="px-2 py-1 rounded-full bg-orange-500 text-white text-xs leading-none"
                    dir="rtl"
                >
          {m}
        </span>
            ))}
        </div>
    );
};

const PostDetailsModal = ({ isOpen, close, data }: PostDetailsModalProps) => {
    const created = Date.parse(data.createdAt || new Date().toISOString());
    if (Number.isNaN(created)) throw new Error("Invalid createdAt");

    const diffMs = Math.max(0, Date.now() - created);
    const diffMin = Math.floor(diffMs / 60000);

    const [comentsCount] = useState(12);

    const likeMutation = useLikePost();
    const handleLike = () => likeMutation.mutate({ postId: data._id });

    const saveMutation = useSavePost();
    const handleSave = () => saveMutation.mutate({ postId: data._id });

    const navigate = useNavigate();
    const handleCommentClick = () => navigate("/post");

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            size="xLarge"
            className="max-w-[95vw] xl:max-w-[1100px] 2xl:max-w-[1280px]"
        >
            <div className="max-h-[80vh] overflow-auto">
                <div className="flex items-center justify-between px-4 py-2">
                    <Expand
                        className="text-red-500 cursor-pointer"
                        onClick={() => navigate(ROUTES.POST_DETAIL)}
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
          "
                >
                    <div className="min-w-0">
                        <div className="relative w-full">
                            <div className="w-full max-h-[65vh] lg:max-h-[60vh] xl:max-h-[58vh] 2xl:max-h-[55vh] overflow-hidden">
                                <ImageSlider images={data.urls} />
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0 flex flex-col gap-6 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full shrink-0"
                                />
                                <span className="text-xl font-bold truncate text-right">mhmz</span>
                            </div>
                            <Button
                                label="ویرایش پست"
                                type="button"
                                icon={<img src={edit} />}
                                className="flex items-center justify-center gap-2 px-3 py-1 text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-3 min-w-0">
                            <span className="text-xs text-gray-500">{diffMin} دقیقه پیش</span>

                            <div className="max-h-[40vh] overflow-auto pr-1">
                                <Caption text={data.caption} />
                            </div>

                           <Mentions items={data.mentions} />
                        </div>

                        <div className="flex items-center gap-6 flex-wrap">
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
                                label={data.like_count.toString()}
                                icon={<img src={like} />}
                                className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                            />
                            <Button
                                type="button"
                                onClick={handleSave}
                                icon={<img src={savePost} />}
                                label={data.save_count.toString()}
                                className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostDetailsModal;
