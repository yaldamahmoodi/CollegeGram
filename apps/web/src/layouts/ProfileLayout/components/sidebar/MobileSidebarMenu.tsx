// components/sidebar/MobileSidebarMenu.tsx
import { useLocation } from "react-router-dom";
import { useUserInfo } from "@hooks/user.hook";
import avatar from "@assets/images/username.png";
import { SidebarValueMobile } from "@/layouts/ProfileLayout/components/sidebar/const";
import SidebarItems from "@/layouts/ProfileLayout/components/sidebar/SidebarItem";

const MobileSidebarMenu = () => {
    const location = useLocation();
    const { data: user } = useUserInfo();

    const isActive = (link: string) => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        const itemSegment = link?.replace("/", "");
        return pathSegments.includes(itemSegment);
    };

    return (
        <div className="flex flex-col h-full px-3 py-2">
            <div className="flex items-center gap-3 my-3">
                <img
                    src={user?.profilePhotoUrl || avatar}
                    alt="profile"
                    className="w-11 h-11 rounded-full object-cover"
                />
                <span className="text-gray-800 font-semibold text-m">
          {user?.username}

        </span>
            </div>
            <hr className="w-full border-gray-400 my-3 p-0" />

            <div className="flex flex-col gap-2">
                {SidebarValueMobile.map((item) => (
                    <SidebarItems
                        key={item.id}
                        isActive={isActive(item.link)}
                        link={item.link}
                        icon={item.icon}
                        text={item.text}
                    />
                ))}
            </div>
        </div>
    );
};

export default MobileSidebarMenu;
