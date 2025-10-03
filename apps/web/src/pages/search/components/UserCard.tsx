import NoUserIcon from "@assets/images/username.png";
import type { SearchUser } from "@app-types/user";

interface UserCardProps {
    user: SearchUser;
}

const UserCard = ({ user }: UserCardProps) => {
    const { username, profilePhoto, followersCount } = user;

    return (
        <div className="flex flex-col items-center border rounded-2xl px-3 py-4 bg-white border-gray-300 w-full max-w-sm mx-auto">
            <div className="flex items-center w-full mb-4 px-3 py-4">
                <img
                    src={profilePhoto || NoUserIcon}
                    alt={username}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full ml-3 object-cover"
                />
                <div className="flex flex-col text-right pr-2">
          <span className="font-semibold text-sm sm:text-base truncate max-w-[140px]">
            {username}
          </span>
                    <span className="text-xs sm:text-sm text-gray-700 pt-2">
            {followersCount} دنبال‌کننده
          </span>
                </div>
            </div>

            <button className="w-full py-2 sm:py-3 bg-red-500 text-white rounded-3xl text-sm sm:text-base font-medium hover:bg-red-600 transition-colors">
                + دنبال کردن
            </button>
        </div>
    );
};

export default UserCard;
