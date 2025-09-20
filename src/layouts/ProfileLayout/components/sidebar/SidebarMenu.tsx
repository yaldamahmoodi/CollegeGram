import avatar from "@assets/images/avatar.png";
import { useLocation } from "react-router-dom";
import { SidebarValue, SidebarBottomValue } from "./const";
import SidebarItems from "./SidebarItem";

const SidebarMenu = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col ">
      <div className="flex items-center gap-3 my-5 px-3">
        <img
          src={avatar}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-gray-800 font-semibold">mahzm</span>
      </div>

      <div className="flex flex-col gap-3">
        {SidebarValue.map((item) => {
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
