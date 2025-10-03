import ImageSlider from "@components/ImageSlider";
import noAvatarIcon from "@assets/images/username.png";
import LikeIcon from "@assets/icons/like.svg";
import commentIcon from "@assets/icons/comment.svg";
import sendIcon from "@assets/icons/sendComment.svg";
import replayComment from "@assets/icons/replay.svg";
import unLikeIcon from "@assets/icons/like.svg";
import unSaveIcon from "@assets/icons/savePost.svg";
import savedIcon from "@assets/icons/saved.svg";
import likedIcon from "@assets/icons/liked.svg";
import Button from "@/components/Button";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { PostActionPayloadType } from "@app-types/post";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import {
    useCreateComment,
    useGetPostById,
    useLikeComment,
    useLikePost,
    usePostComments,
    useSavePost,
    useUnLikePost,
    useUnSavePost,
} from "@/hooks/post.hook";
import { useState } from "react";

const PostDetail = () => {
    const [newComment, setNewComment] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["userInfo"]);

    const { id } = useParams<{ id: string }>();
    const { data: post } = useGetPostById(id);
    const { data: comments } = usePostComments(post?._id);

    const addCommentMutation = useCreateComment();
    const likeCommentMutation = useLikeComment();
    const likePostMutation = useLikePost();
    const unLikePostMutation = useUnLikePost();
    const savePostMutation = useSavePost();
    const unSavePostMutation = useUnSavePost();

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        addCommentMutation.mutate({
            post_id: post?._id,
            content: newComment,
        });
        setNewComment("");
    };

    const handleReplyComment = (parentId: string) => {
        if (!replyContent.trim()) return;
        addCommentMutation.mutate({
            post_id: post?._id,
            content: replyContent,
            parent_comment: parentId,
        });
        setReplyContent("");
        setReplyingTo(null);
    };

    const handleLikeToggle = () => {
        const payload: PostActionPayloadType = { postId: post?._id! };
        if (post?.isLiked) unLikePostMutation.mutate(payload);
        else likePostMutation.mutate(payload);
    };

    const handleSaveToggle = () => {
        const payload: PostActionPayloadType = { postId: post?._id! };
        if (post?.isSaved) unSavePostMutation.mutate(payload);
        else savePostMutation.mutate(payload);
    };

    const handleToggleLikeComment = (id: string) => {
        likeCommentMutation.mutate({ commentId: id });
    };

    const mainComments = comments?.filter((c) => c.parent_comment === null) || [];
    const repliesMap =
        comments?.reduce((acc: Record<string, (typeof comments)[0][]>, c) => {
            if (c.parent_comment) {
                if (!acc[c.parent_comment]) acc[c.parent_comment] = [];
                acc[c.parent_comment].push(c);
            }
            return acc;
        }, {} as Record<string, (typeof comments)[0][]>) || {};

    return (
        <div className="max-w-5xl mx-auto p-2 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className=" right-2 flex items-center gap-3  p-1 md:hidden">
                    <img
                        src={noAvatarIcon}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="font-semibold text-orange-500 truncate">
                        {user?.data?.username}
                    </p>
                </div>

                <div className="w-full md:h-[500px] h-[300px]">
                    <ImageSlider images={post?.urls || []} />
                </div>

                <div className="flex justify-end items-center gap-4 md:hidden px-2 mt-2 sm:mt-10">
                    <Button
                        type="button"
                        label={comments?.length.toString() || "0"}
                        onClick={handleAddComment}
                        icon={<img src={commentIcon} />}
                        className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                        style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                    />
                    <Button
                        type="button"
                        onClick={handleLikeToggle}
                        label={post?.like_count.toString() || "0"}
                        icon={<img src={post?.isLiked ? likedIcon : unLikeIcon} />}
                        className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                        style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                    />
                    <Button
                        type="button"
                        onClick={handleSaveToggle}
                        icon={<img src={post?.isSaved ? savedIcon : unSaveIcon} />}
                        label={post?.save_count.toString() || "0"}
                        className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                        style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                    />
                </div>

                <div className="flex flex-col space-y-4 ">
                    <div className="flex items-center gap-3 hidden md:flex">
                        <img
                            src={noAvatarIcon}
                            alt="user"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold text-orange-500 truncate max-w-[150px] md:max-w-[200px]">
                                {user?.data?.username}
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500">
                        {formatRelativeTime(user?.data?.createdAt)}
                    </p>

                    <p className="text-sm md:text-base leading-6 text-gray-700 break-words">
                        {post?.caption}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6 mt-3">
                        {post?.mentions.map((mention, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 text-xs md:text-sm text-white rounded-md cursor-pointer bg-orange-500 hover:bg-orange-600 truncate">
                {mention}
              </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-start md:justify-end items-center gap-4 md:gap-6 hidden md:flex">
                        <Button
                            type="button"
                            label={comments?.length.toString() || "0"}
                            onClick={handleAddComment}
                            icon={<img src={commentIcon} />}
                            className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                            style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                        />
                        <Button
                            type="button"
                            onClick={handleLikeToggle}
                            label={post?.like_count.toString() || "0"}
                            icon={<img src={post?.isLiked ? likedIcon : unLikeIcon} />}
                            className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                            style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                        />
                        <Button
                            type="button"
                            onClick={handleSaveToggle}
                            icon={<img src={post?.isSaved ? savedIcon : unSaveIcon} />}
                            label={post?.save_count.toString() || "0"}
                            className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                            style={{ minWidth: "auto", paddingLeft: 0, paddingRight: 0 }}
                        />
                    </div>

                    <div className="flex flex-row items-center gap-2 pb-3 ">
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
                            <img src={sendIcon} className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>

                    <div className="space-y-4 pt-2 text-sm max-h-80 overflow-y-auto pr-2">
                        {mainComments.length
                            ? mainComments.map((comment) => (
                                <div key={comment._id} className="pb-3 mb-2 last:border-none">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-2">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{comment.username}</p>
                                            <span className="text-xs text-gray-500">
                          {formatRelativeTime(
                              comment.updatedAt || comment.createdAt
                          )}
                        </span>
                                        </div>

                                        <div className="flex gap-4 mt-2 sm:mt-0 text-red-500 items-center">
                                            <button
                                                className="flex gap-1 hover:opacity-80"
                                                onClick={() => handleToggleLikeComment(comment._id)}>
                                                <span>{comment.like_count}</span>
                                                <img src={LikeIcon} className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="flex gap-1 hover:opacity-80 text-gray-500"
                                                onClick={() =>
                                                    setReplyingTo(
                                                        replyingTo === comment._id ? null : comment._id
                                                    )
                                                }>
                                                <img src={replayComment} className="w-4 h-4" />
                                                <span className="text-red-500">پاسخ</span>
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mt-1 break-words">{comment.content}</p>

                                    {replyingTo === comment._id && (
                                        <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 ml-6">
                                            <img
                                                src={noAvatarIcon}
                                                alt="me"
                                                className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                                            />
                                            <input
                                                type="text"
                                                placeholder="پاسخ خود را بنویسید..."
                                                className="flex-1 border border-gray-300 bg-white rounded-full px-3 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                onKeyDown={(e) =>
                                                    e.key === "Enter" && handleReplyComment(comment._id)
                                                }
                                            />
                                            <button
                                                onClick={() => handleReplyComment(comment._id)}
                                                className="text-orange-500 hover:text-orange-600">
                                                <img src={sendIcon} className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </div>
                                    )}

                                    {repliesMap[comment._id]?.map((reply) => (
                                        <div key={reply._id} className="ml-6 mt-2 pr-2">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-2">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{reply.username}</p>
                                                    <span className="text-xs text-gray-500">
                              {formatRelativeTime(
                                  reply.updatedAt || reply.createdAt
                              )}
                            </span>
                                                </div>

                                                <div className="flex gap-4 mt-2 sm:mt-0 text-red-500 items-center">
                                                    <button
                                                        className="flex gap-1 hover:opacity-80"
                                                        onClick={() =>
                                                            handleToggleLikeComment(reply._id)
                                                        }>
                                                        <span>{reply.like_count}</span>
                                                        <img src={LikeIcon} className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="flex gap-1 hover:opacity-80 text-gray-500"
                                                        onClick={() =>
                                                            setReplyingTo(
                                                                replyingTo === reply._id ? null : reply._id
                                                            )
                                                        }>
                                                        <img src={replayComment} className="w-4 h-4" />
                                                        <span className="text-red-500">پاسخ</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 mt-1 break-words">{reply.content}</p>

                                            {replyingTo === reply._id && (
                                                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 ml-6">
                                                    <img
                                                        src={noAvatarIcon}
                                                        alt="me"
                                                        className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="پاسخ خود را بنویسید..."
                                                        className="flex-1 border border-gray-300 bg-white rounded-full px-3 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        onKeyDown={(e) =>
                                                            e.key === "Enter" &&
                                                            handleReplyComment(reply._id)
                                                        }
                                                    />
                                                    <button
                                                        onClick={() => handleReplyComment(reply._id)}
                                                        className="text-orange-500 hover:text-orange-600">
                                                        <img src={sendIcon} className="w-4 h-4 md:w-5 md:h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))
                            : "برای این پست هنوز نظری ثبت نشده"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
