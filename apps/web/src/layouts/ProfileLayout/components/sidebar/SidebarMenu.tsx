import { useState } from "react";
import avatar from "@assets/images/username.png";
import { useLocation } from "react-router-dom";
import { SidebarValue, SidebarBottomValue, SidebarFooterValue } from "./const";
import SidebarItems from "./SidebarItem";
import { useUserInfo } from "@hooks/user.hook.ts";
import { useAuth } from "@hooks/useAuth";
import { useUnreadCount } from "@/hooks/notification.hook";

export const SidebarPopUp = ({item, isActive}) => <div className=" absolute bottom-full left-0 mb-2 z-50 min-w-48 rounded-2xl border border-gray-200 bg-white shadow-xl p-2 flex flex-col gap-1">
{item.children.map((child) => (
  <SidebarItems
    key={child.id}
    isActive={isActive(child.link)}
    link={child.link}
    icon={child.icon}
    text={child.text}
  />
))}
</div>


const SidebarMenu = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const {data:user} = useUserInfo();
  const {data: unreadCount} = useUnreadCount();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (link: string) => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const itemSegment = link?.replace("/", "");
    return pathSegments.includes(itemSegment);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 my-5 px-3">
        <img
          src={user?.profilePhotoUrl || avatar}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-gray-800 font-semibold w-3">
          {user && user?.username}
        </span>
        <span
          className="mr-auto text-red-500 text-md cursor-pointer px-3"
          onClick={() => handleLogout()}>
          خروج
        </span>
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
        {SidebarBottomValue.map((item) => (
          <SidebarItems
            key={item.id}
            isActive={isActive(item.link)}
            link={item.link}
            icon={item.icon}
            text={item.text}
          />
        ))}
      </div>

      <div className="mt-auto mb-5 px-3">
        {SidebarFooterValue.map((item) => (
          <div key={item.id} className="flex flex-col">
            <div className="relative">
              <div onClick={() => toggleDropdown(item.id)}>
                <SidebarItems
                  isActive={false}
                  icon={item.icon}
                  text={item.text}
                />
              </div>
              {openDropdown === item.id && item.children?.length > 0 && (
                  <SidebarPopUp isActive={isActive} item={item} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarMenu;
