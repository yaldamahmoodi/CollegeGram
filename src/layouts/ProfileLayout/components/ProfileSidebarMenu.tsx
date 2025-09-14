import avatar from "@assets/images/avatar.png";
import account from "@assets/icons/account.svg";
import SidebarButton, {type SidebarProps} from "@/layouts/ProfileLayout/components/SidebarButton.tsx";
import {useLocation} from "react-router-dom";



const SidebarItems: Array<SidebarProps & {id:string}> = [
    {
        link: "/dashboard",
        icon: account,
        text: "صفحه من",
        id:"home"
    },
    {
        link: "/save",
        icon: account,
        text: "ذخیره ها",
        id:"save"
    },
    {
        link: "/message",
        icon: account,
        text: "پیام ها",
        id: "message"
    },
    {
        link: "/notif",
        icon: account,
        text: "اعلانات",
        id: "notif"
    },
    {
        link: "/tag",
        icon: account,
        text: "تگ شده ها",
        id: "tag"
    }
]


const ProfileSidebarMenu = () => {

    const location = useLocation();

    return (
        <div className="p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={avatar}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-gray-800 font-semibold">mahzm</span>
            </div>
            <hr className="border-gray-200 mb-4"/>
            <div className="flex flex-col gap-4">
            {
                SidebarItems.map(item => {
                    const pathSegments = location.pathname.split("/").filter(Boolean);
                    const itemSegment = item.link.replace("/", "");

                    const isActive = pathSegments.includes(itemSegment);
                       return  <SidebarButton key={item.id} isActive={isActive} link={item.link} icon={item.icon} text={item.text}/>
                    }
                )
            }
            </div>
            <hr className="border-gray-200 mb-4"/>


        </div>
    );
};

export default ProfileSidebarMenu;
