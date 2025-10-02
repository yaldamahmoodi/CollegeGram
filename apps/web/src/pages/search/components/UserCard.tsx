import NoUserIcon from "@assets/images/username.png";
type UserCardType = {
  id: number;
  name: string;
  avatar: string;
  followersCount: number;
};

interface UserCardProps {
  user: UserCardType;
}

const UserCard = (props: UserCardProps) => {
  const { name, avatar, followersCount } = props.user;
  return (
    <div className="flex flex-col items-center border rounded-4xl px-4 py-6 bg-white border-gray-300">
      <div className="flex items-center w-full mb-4 px-5 py-8">
        <img
          src={avatar ? avatar : NoUserIcon}
          alt={name}
          className="w-[64px] h-[64px] rounded-full ml-3"
        />
        <div className="flex flex-col text-right pr-2">
          <span className="font-semibold text-md">{name}</span>
          <span className="text-sm text-gray-700 pt-3">
            {followersCount} هزار دنبال‌کننده‌ها
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
