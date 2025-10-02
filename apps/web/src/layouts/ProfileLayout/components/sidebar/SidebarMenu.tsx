import avatar from "@assets/images/avatar.png";
import { useLocation } from "react-router-dom";
import { SidebarValue, SidebarBottomValue } from "./const";
import SidebarItems from "./SidebarItem";
import { useUserInfo } from "@hooks/user.hook.ts";
import { useAuth } from "@hooks/useAuth";
import Button from "@/components/Button";
import { useUnreadCount } from "@/hooks/notification.hook";

const SidebarMenu = () => {
  const location = useLocation();
  const {data:user} = useUserInfo();
  const {data: unreadCount} = useUnreadCount();
  const { data: user } = useUserInfo();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-row items-center gap-3 my-5 px-3 w-full">
        <div className="flex flex-row items-center w-3/4">
          <img
            src={(user && user.profilePhotoUrl) || avatar}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="text-gray-800 font-semibold mr-3">
            {user && user.username}
          </span>
        </div>
        <div>
          <Button
            label={"خروج"}
            onClick={handleLogout}
            className="bg-transparent !text-red-500 flex justify-end self-end hover:bg-white cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {SidebarValue.map((item) => {
          const pathSegments = location.pathname.split("/").filter(Boolean);
          const itemSegment = item.link.replace("/", "");

          const isActive = pathSegments.includes(itemSegment);
          const showBadge = item.id === "notification" && unreadCount && unreadCount > 0;
          
          return (
            <SidebarItems
              key={item.id}
              isActive={isActive}
              link={item.link}
              icon={item.icon}
              text={item.text}
              badge={showBadge ? unreadCount : undefined}
            />
          );
        })}
      </div>
      <hr className="w-full border-gray-400 my-8 p-0" />
      <div className="flex flex-col gap-3">
        {SidebarBottomValue.map((item) => {
          const pathSegments = location.pathname.split("/").filter(Boolean);
          const itemSegment = item.link.replace("/", "");

          const isActive = pathSegments.includes(itemSegment);
          return (
            <SidebarItems
              key={item.id}
              isActive={isActive}
              link={item.link}
              icon={item.icon}
              text={item.text}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarMenu;
