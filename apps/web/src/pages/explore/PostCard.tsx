import DefaultAvatar from "@assets/images/avatar.png";
import Button from "@components/Button";
import likeIcon from "@assets/icons/likes-black.svg";
import saveIcon from "@assets/icons/save-black.svg";
import commentIcon from "@assets/icons/comment-black.svg";

export type PostCardType = {
    _id: string;
    username: string;
    followerCount: string;
    userAvatar?: string;
    imageUrl: string;
    like_count: number;
    save_count: number;
    comment_count?: number;
    isLiked?: boolean;
    isSaved?: boolean;
};

interface PostCardProps {
    post: PostCardType;
    onLike?: (postId: string) => void;
    onSave?: (postId: string) => void;
    onOpen?: (postId: string) => void;
}

const PostCard = ({ post, onLike, onSave, onOpen }: PostCardProps) => {
    const { _id, username, followerCount, userAvatar, imageUrl, like_count, save_count, comment_count = 0, isLiked, isSaved } = post;

    return (
        <div className="flex flex-col border rounded-3xl overflow-hidden bg-white border-gray-300">
            <div
                onClick={() => onOpen?.(_id)}
                className="w-full cursor-pointer group relative"
                role="button"
                aria-label="open post"
            >
                <img
                    src={imageUrl}
                    alt="post"
                    className="w-full h-[260px] object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                    loading="lazy"
                />
            </div>

            <div className="flex items-center gap-6 pt-1 border-t border-gray-200 px-3">
                <Button
                    type="button"
                    onClick={() => onOpen?.(_id)}
                    icon={<img src={commentIcon} />}
                    label={String(comment_count)}
                    className="flex flex-row gap-2  items-center bg-transparent hover:bg-transparent !text-black"
                    style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                />
                <Button
                    type="button"
                    onClick={() => onLike?.(_id)}
                    icon={<img src={likeIcon} />}
                    label={String(like_count)}
                    className={`flex flex-row gap-2  items-center bg-transparent hover:bg-transparent !text-black ${isLiked ? "!text-black" : ""}`}
                    style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                />
                <Button
                    type="button"
                    onClick={() => onSave?.(_id)}
                    icon={<img src={saveIcon}/>}
                    label={String(save_count)}
                    className={`flex flex-row gap-2 items-center bg-transparent hover:bg-transparent !text-black ${isSaved ? "!text-black" : ""}`}
                    style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                />
            </div>

            <div className="flex flex-col p-4 gap-3">
                <div className="flex items-center gap-2">
                    <img
                        src={userAvatar || DefaultAvatar}
                        alt={username}
                        className="w-10 h-10 rounded-full object-cover"
                        loading="lazy"
                    />
                    <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{username}</span>
                    <span className="font-normal text-xs text-gray-500">{followerCount}</span>
                </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
