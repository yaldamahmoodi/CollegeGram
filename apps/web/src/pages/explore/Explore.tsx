import { useNavigate, generatePath } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import PostCard from "@/pages/explore/PostCard";
import type { PostCardType } from "@/pages/explore/PostCard";
import { MESSAGES } from "@/const/message";
import Button from "@components/Button.tsx";
import { useExplorePosts, useLikePost, useSavePost } from "@/hooks/post.hook.ts";
import { useMemo } from "react";

function Explore() {
    const navigate = useNavigate();
    const { data, isLoading } = useExplorePosts(1, 12);

    const likeMut = useLikePost();
    const saveMut = useSavePost();

    const posts: PostCardType[] = useMemo(
        () =>
            (data?.data ?? []).map((item: any) => ({
                _id: item.post_id,
                username: `${item.firstname} ${item.lastname}`,
                followerCount: `${item.following_count ?? 0} نفر دنبال کننده`,
                userAvatar: item.profilePhotoUrl,
                imageUrl: item.urls?.[0] ?? "",
                like_count: item.like_count ?? 0,
                save_count: item.save_count ?? 0,
                comment_count: item.comment_count ?? 0,
                isLiked: false,
                isSaved: false,
            })),
        [data]
    );

    const goPost = (id: string) => {
        const path = generatePath(ROUTES.POST_DETAIL, { id });
        navigate(path);
    };

    const toggleLike = (id: string) => {
        const current = posts.find((p) => p._id === id);
        likeMut.mutate({ postId: id, isLiked: current?.isLiked } as any);
    };

    const toggleSave = (id: string) => {
        const current = posts.find((p) => p._id === id);
        saveMut.mutate({ postId: id, isSaved: current?.isSaved } as any);
    };

    return (
        <div className="px-4 py-6">
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-[360px] rounded-3xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            )}

            {!isLoading && posts.length === 0 && (
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="flex flex-col items-center justify-center gap-6 text-center">
                        <div className="font-semibold mb-2 text-4xl">
                            {MESSAGES.exploreHedging}
                        </div>
                        <p className="max-w-md text-xl">{MESSAGES.exploreParagraph}</p>
                        <Button type="button" label="جستجوی کالچ گرامی ها" />
                    </div>
                </div>
            )}

            {!isLoading && posts.length > 0 && (
                <>
                    <div className="w-full flex mb-6">
                        <h1 className="text-3xl font-bold">اکسپلور</h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onOpen={goPost}
                                onLike={toggleLike}
                                onSave={toggleSave}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Explore;
