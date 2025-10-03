import NoUserIcon from "@assets/images/username.png";
import type { SearchUser } from "@app-types/user";

interface UserCardProps {
  user: SearchUser;
}

const UserCard = (props: UserCardProps) => {
  const { username, profilePhoto, followersCount } = props.user;
  return (
    <div className="flex flex-col items-center border rounded-4xl px-4 py-6 bg-white border-gray-300">
      <div className="flex items-center w-full mb-4 px-5 py-8">
        <img
          src={profilePhoto ? profilePhoto : NoUserIcon}
          alt={username}
          className="w-[64px] h-[64px] rounded-full ml-3"
        />
        <div className="flex flex-col text-right pr-2">
          <span className="font-semibold text-md">{username}</span>
          <span className="text-sm text-gray-700 pt-3">
            {followersCount} دنبال‌کننده‌ها
          </span>
        </div>
      </div>
      <button className="w-full py-3 bg-red-500 text-white rounded-3xl font-medium hover:bg-red-600">
        + دنبال کردن
      </button>
    </div>
  );
};
export default UserCard;
