import { useState } from "react";
// import PostDetailsModal from "@/layouts/ProfileLayout/components/PostDetailsModal.tsx";

interface Post {
  id: string;
  url: string;
  caption: string;
}

const TaggedPosts = () => {
  const mockPosts: Post[] = [
    {
      id: "1",
      url: "https://picsum.photos/400/300?random=1",
      caption: "پست اول",
    },
    {
      id: "2",
      url: "https://picsum.photos/400/300?random=2",
      caption: "پست دوم",
    },
    {
      id: "3",
      url: "https://picsum.photos/400/300?random=3",
      caption: "پست سوم",
    },
  ];

  const [posts] = useState<Post[]>(mockPosts);
  const [_, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="tag-page w-full p-4">
      {posts.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2">
          <h3 className="text-lg font-bold">هنوز کسی تگت نکرده!</h3>
          <p>اینجا تمام پست‌هایی که توشون تگ شدی رو میتونی ببینی.</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">تگ شده‌ها</h2>
          <div className="flex flex-wrap gap-6">
            {posts.map((post) => (
              <img
                key={post.id}
                src={post.url}
                alt={post.caption}
                className="w-64 h-64 rounded-2xl cursor-pointer object-cover"
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        </div>
      )}

      {/*
      {selectedPost && (
        <PostDetailsModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          images={[selectedPost.url]}
        />
      )}
      */}
    </div>
  );
};

export default TaggedPosts;
