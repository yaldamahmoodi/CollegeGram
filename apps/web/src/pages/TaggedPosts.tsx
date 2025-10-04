import { useTaggedPostList } from "@/hooks/post.hook";
import { useNavigate, generatePath } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import type { SavedPostItem } from "@/types/post.ts";
import { MESSAGES } from "@/const/message.ts";
import ImageGroup from "@components/ImageGroup.tsx";

const TaggedPosts = () => {
    const { data, isLoading } = useTaggedPostList();
    const navigate = useNavigate();

    const posts: SavedPostItem[] = data?.savedPosts ?? [];

    const gotoDetails = (id: string) => {
        const path = generatePath(ROUTES.POST_DETAIL, { id });
        navigate(path);
    };

    return (
        <div className="tag-page w-full h-full p-4 grid-cols-3">
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-64 h-64 bg-gray-100 animate-pulse rounded-2xl"
                        />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="w-full h-full flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="font-semibold mb-2 text-4xl">
                       {MESSAGES.taggedPageHeading}
                        </div>
                        <p className="max-w-md text-2xl text-center">{MESSAGES.taggedPageParagraph}</p>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-bold mb-4">{MESSAGES.taggedPage}</h2>
                    <div className="grid grid-cols-12 gap-6">
                        {posts.map((item) => (
                            <div
                                key={item._id}
                                className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-4"
                            >
                                <ImageGroup
                                    urls={item.firstUrl ?? ""}
                                    photoCount={item.photo_length}
                                    onClick={() => gotoDetails(item._id)}
                                />
                            </div>

                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaggedPosts;
