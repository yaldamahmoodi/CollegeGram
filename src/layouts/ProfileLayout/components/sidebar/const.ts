import { ROUTES } from "@/routes/routes";
import pinIcon from "@assets/icons/pin.svg";
import saveIcon from "@assets/icons/save.svg";
import messsageIcon from "@assets/icons/message.svg";
import notificationIcon from "@assets/icons/notification.svg";
import tagIcon from "@assets/icons/tah.svg";
import exploreIcon from "@assets/icons/explore.svg";
import searchIcon from "@assets/icons/search.svg";

export const SidebarValue = [
  {
    link: ROUTES.PROFILE,
    icon: pinIcon,
    text: "صفحه من",
    id: "home",
  },
  {
    link: ROUTES.SAVED_POSTS,
    icon: saveIcon,
    text: "ذخیره ها",
    id: "save",
  },
  {
    link: ROUTES.MESSAGES,
    icon: messsageIcon,
    text: "پیام ها",
    id: "message",
  },
  {
    link: ROUTES.NOTIFICATIONS,
    icon: notificationIcon,
    text: "اعلانات",
    id: "notif",
  },
  {
    link: ROUTES.TAGGED_POSTS,
    icon: tagIcon,
    text: "تگ شده ها",
    id: "tag",
  },
];

export const SidebarBottomValue = [
  {
    link: ROUTES.EXPLORE,
    icon: exploreIcon,
    text: "صفحه من",
    id: "home",
  },
  {
    link: ROUTES.SEARCH,
    icon: searchIcon,
    text: "ذخیره ها",
    id: "save",
  },
];
