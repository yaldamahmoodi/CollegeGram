import { usePosts } from "@hooks/post.hook";
import Button from "@components/Button";

interface UserPostsProps {
  onChangeModal: () => void;
}

const UserPosts = (props: UserPostsProps) => {
  const { onChangeModal } = props;

  const { data } = usePosts();
  const mockPosts = [
    {
      id: "0",
      url: "https://picsum.photos/400/300?random=1",
    },
    {
      id: "1",
      url: "https://picsum.photos/400/300?random=2",
    },
    {
      id: "2",
      url: "https://picsum.photos/400/300?random=3",
    },
  ];
  return (
    <div className="profile-posts w-full h-full flex-auto border border-gray-400 p-4 overflow-y-auto rounded-4xl">
      {mockPosts ? (
        <div className="flex flex-col-3 gap-4">
          {mockPosts.map((item) => {
            return <img src={item.url} className="W-60 h-60  rounded-2xl" />;
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
