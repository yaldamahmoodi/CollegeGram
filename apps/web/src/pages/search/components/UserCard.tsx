import NoUserIcon from "@assets/images/username.png";
import type { SearchUser } from "@app-types/user";
import { useFollow, useUnFollow, useFollowingList } from "@/hooks/user.hook";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: SearchUser;
}

const UserCard = ({ user }: UserCardProps) => {
  const { username, follower_count, id } = user;

  const navigate = useNavigate();

  const { data: followings } = useFollowingList(true);
  const { mutate: follow } = useFollow();
  const { mutate: unFollow } = useUnFollow();

  const isFollowing = followings?.some((f: any) => f.userId === id);

  const handleClick = () => {
    if (isFollowing) {
      unFollow({ followerUserId: id });
    } else {
      follow({ followerUserId: id });
    }
  };

  return (
    <div className="flex flex-col items-center border rounded-4xl px-4 py-6 bg-white border-gray-300">
      <div
        className="flex items-center w-full mb-4 px-5 py-8 hover:cursor-pointer"
        onClick={() => navigate(`/user/${username}`)}>
        <img
          src={NoUserIcon}
          alt={username}
          className="w-[64px] h-[64px] rounded-full ml-3"
        />
        <div className="flex flex-col text-right pr-2">
          <span className="font-semibold text-md">{username}</span>
          <span className="text-xs sm:text-sm text-gray-700 pt-2">
            {follower_count} دنبال‌کننده‌ها
          </span>
        </div>
      </div>
      <button
        className={`w-full py-3 rounded-3xl font-medium  w-full py-2 sm:py-3 bg-red-500 text-white rounded-3xl text-sm sm:text-base font-medium hover:bg-red-600 transition-colors${
          isFollowing
            ? "bg-gray-300 text-black hover:bg-gray-400"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
        onClick={handleClick}>
        {isFollowing ? "دنبال نکردن" : "دنبال کردن"}
      </button>
    </div>
  );
};

export default UserCard;
