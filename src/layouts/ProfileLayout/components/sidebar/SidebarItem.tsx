import { Link } from "react-router-dom";

export interface SidebarItemsProps {
  link: string;
  icon: string;
  text: string;
}

const SidebarItems = (props: SidebarItemsProps & { isActive: boolean }) => (
  <div className="flex flex-col text-base">
    <Link
      to={props.link}
      className={`flex items-center justify-right  ${
        props.isActive && "bg-gray-100"
      }  text-gray-700 w-full px-4 py-2 rounded-3xl transition  hover:bg-gray-200`}>
      <img src={props.icon || ""} alt={props.text} className="ml-3" />
      <span className="text-gray-700">{props.text}</span>
    </Link>
  </div>
);

export default SidebarItems;
