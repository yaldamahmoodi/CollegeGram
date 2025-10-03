import { NavLink } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const checkIsActive = (isActive: boolean) =>
  isActive ? "text-gray-900" : "text-gray-400";

const NavTabs = () => {
  return (
    <nav className="w-3xs flex flex-row justify-around text-xl gap-3 mb-15">
      <NavLink
        to={ROUTES.CLOSE_FRIEND}
        className={({ isActive }) => checkIsActive(isActive)}>
        دوستان نزدیک
      </NavLink>
      <span className="text-normal text-gray-500 mx-2">|</span>
      <NavLink
        to={ROUTES.BLOCK_LIST}
        className={({ isActive }) => checkIsActive(isActive)}>
        لیست سیاه
      </NavLink>
    </nav>
  );
};

export default NavTabs;
