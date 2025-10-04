import PostCard from "@/pages/explore/PostCard";
import { MESSAGES } from "@/const/message";
import Button from "@components/Button.tsx";
import { useExplorePosts } from "@/hooks/post.hook.ts";

function Explore() {
  const { data: explorePosts, isLoading } = useExplorePosts(1, 12);

  return (
    <div className="px-4 py-6">
      {!isLoading && (!explorePosts || explorePosts.length === 0) && (
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

      {!isLoading && explorePosts && explorePosts.length > 0 && (
        <>
          <div className="w-full flex mb-6">
            <h1 className="text-3xl font-bold">{MESSAGES.exploreTitle}</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {explorePosts.map((post: any) => (
              <PostCard key={post.post_id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Explore;
