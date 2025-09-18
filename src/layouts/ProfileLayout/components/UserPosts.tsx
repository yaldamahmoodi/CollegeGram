import { usePosts } from "@hooks/post.hook";
import Button from "@components/Button";
import type { PostInfo, Posts } from "@app-types/post";
import { getImageUrl } from "@/utils/url";

interface UserPostsProps {
  onChangeModal: () => void;
}

const UserPosts = (props: UserPostsProps) => {
  const { onChangeModal } = props;

  // let list = [
  //   { id: 1, urls: "https://picsum.photos/200/300?random=1" },
  //   { id: 2, urls: "https://picsum.photos/200/300?random=2" },
  //   { id: 3, urls: "https://picsum.photos/200/300?random=3" },
  //   { id: 4, urls: "https://picsum.photos/200/300?random=4" },
  // ];

  const { data: posts, isError, error } = usePosts();

  if (isError) {
    console.log("error:::", error);
  }
  return (
    <div className="profile-posts w-full h-full flex-auto border border-gray-400 p-4 overflow-y-auto rounded-4xl">
      {posts?.data?.length ? (
        <div className="flex justify-center grid lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 justify-evently gap-5 p-5">
          {posts?.data?.map((post: PostInfo) => {
            const url = getImageUrl(post.urls[0]);
            return (
              <div className="flex" key={post._id}>
                <img
                  src={url}
                  className="w-[400px] max-h-[400px] rounded-3xl"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
          <span>هنوز هیچ پستی توی صفحه ات نذاشتی!</span>
          <span>بجنب تا دیر نشده</span>
          <Button
            type="button"
            label="+  ایجاد پست جدید"
            variant="danger"
            className="text-basis py-1 text-xs rounded-4xl w-[197px] h-[52px] mt-5"
            onClick={onChangeModal}
          />
        </div>
      )}
    </div>
  );
};

export default UserPosts;
