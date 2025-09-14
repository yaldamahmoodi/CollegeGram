import {Link} from "react-router-dom";

export interface SidebarProps {
    link: string,
    icon: string,
    text: string,
}

const SidebarButton = (props: SidebarProps & { isActive:boolean }) =>
    <div className="flex flex-col gap-2">
        <Link to={props.link}
              className={`flex items-center justify-right  ${props.isActive &&  "bg-gray-100"}  text-gray-700 w-full px-4 py-2 rounded-xl transition  hover:bg-gray-200`}>
            <img src={props.icon || ""} alt={props.text}/>
            <span className="text-gray-700">{props.text}</span>
        </Link>
    </div>

export default SidebarButton;