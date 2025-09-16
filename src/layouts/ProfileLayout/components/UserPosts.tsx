import Button from "@components/Button";
import { use, useEffect, useState } from "react";
import PostDetailsModal from "@/layouts/ProfileLayout/components/PostDetailsModal.tsx";
import { getPosts } from "@/api/post/post.api";

interface UserPostsProps {
    onChangeModal: () => void;
}

const UserPosts = (props: UserPostsProps) => {
    const { onChangeModal } = props;
    const [data, setData] = useState(null);
    // const data  = use(getPosts());
    // console.log(data)
    useEffect(() => {
        (async () => {
          try {
            const dataaa = await getPosts()
            setData(dataaa);
          } catch (err) {
            console.error("API Fetch Error:", err);
          }
        })();
      }, []);
      useEffect(() => {console.log(data)}, [data])

    const mockPosts = [
        { id: "0", url: "https://picsum.photos/400/300?random=1" },
        { id: "1", url: "https://picsum.photos/400/300?random=2" },
        { id: "2", url: "https://picsum.photos/400/300?random=3" },
    ];

    const [selectedPost, setSelectedPost] = useState<{ id: string; url: string } | null>(null);

    return (
        <div className="profile-posts w-full h-full flex-auto border border-gray-400 p-4 overflow-y-auto rounded-4xl">
            {data.length ? (
                <div className="flex flex-wrap gap-10 justify-evenly">
                    {data.map((item) => (
                        <img
                            key={item.id}
                            src={item.url}
                            className="w-80 h-80 rounded-2xl cursor-pointer"
                            onClick={() => setSelectedPost(item)} // ست کردن پست انتخاب شده
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
                    <span>هنوز هیچ پستی توی صفحه ات نذاشتی!</span>
                    <span>بجنب تا دیر نشده</span>
                    <Button
                        type="button"
                        label="+ ایجاد پست جدید"
                        variant="danger"
                        className="text-basis py-1 text-xs rounded-4xl w-[197px] h-[52px] mt-5"
                        onClick={onChangeModal}
                    />
                </div>
            )}

            {selectedPost && (
                <PostDetailsModal
                    isOpen={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                    images={["https://picsum.photos/400/300?random=1","https://picsum.photos/400/300?random=2","https://picsum.photos/400/300?random=3"]}
                />
            )}
        </div>
    );
};

export default UserPosts;
