import { Link } from "react-router-dom";

export interface SidebarItemsProps {
  link?: string;
  icon: string;
  text: string;
  badge?: number;
}

const SidebarItems = (props: SidebarItemsProps & { isActive: boolean }) => (
  <div className="flex flex-col text-base">
    <Link
      to={props.link || "#"}
      className={`flex items-center justify-between ${
        props.isActive && "bg-gray-100"
      }  text-gray-700 w-full px-4 py-2 rounded-3xl transition  hover:bg-gray-200`}>
      <div className="flex items-center">
        <img src={props.icon || ""} alt={props.text} className="ml-3" />
        <span className="text-gray-700">{props.text}</span>
      </div>
      {props.badge && props.badge > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
          {props.badge > 99 ? '99+' : props.badge}
        </span>
      )}
    </Link>
  </div>
);

export default SidebarItems;
