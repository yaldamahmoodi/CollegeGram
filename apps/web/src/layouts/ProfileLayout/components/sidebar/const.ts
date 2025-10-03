import { ROUTES } from "@/routes/routes";
import pinIcon from "@assets/icons/pin.svg";
import saveIcon from "@assets/icons/save.svg";
import messsageIcon from "@assets/icons/message.svg";
import notificationIcon from "@assets/icons/notification.svg";
import tagIcon from "@assets/icons/tah.svg";
import exploreIcon from "@assets/icons/explore.svg";
import searchIcon from "@assets/icons/search.svg";
import moreIcon from "@assets/icons/more.svg";
import friendIcon from "@assets/icons/friendIcon.svg";
import blockIcon from "@assets/icons/blockIcon.svg";

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
    link: ROUTES.NOTIFICATIONS,
    icon: notificationIcon,
    text: "اعلانات",
    id: "notification",
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
    text: " اکسپلور",
    id: "explore",
  },
  {
    link: ROUTES.SEARCH,
    icon: searchIcon,
    text: "جستجو ",
    id: "search",
  },
];

export const SidebarFooterValue = [
    {
        icon: moreIcon,
        text: "بیشتر",
        id: "more",
        children: [
            {
                id: "close-friend",
                text: "دوستان نزدیک",
                icon: friendIcon,
                link: ROUTES.CLOSE_FRIEND },
            {
                id: "block-list",
                text: "لیست سیاه",
                icon: blockIcon,
                link: ROUTES.BLOCK_LIST
            },
        ],

    }
]



export const SidebarValueMobile = [
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
        id: "notification",
    },
    {
        link: ROUTES.TAGGED_POSTS,
        icon: tagIcon,
        text: "تگ شده ها",
        id: "tag",
    },
    {
        id: "close-friend",
        text: "دوستان نزدیک",
        icon: friendIcon,
        link: ROUTES.CLOSE_FRIEND },
    {
        id: "block-list",
        text: "لیست سیاه",
        icon: blockIcon,
        link: ROUTES.BLOCK_LIST
    },
];
