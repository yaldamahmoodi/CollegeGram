import { NavLink } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const checkIsActive = (isActive: boolean) =>
  isActive ? "text-gray-900" : "text-gray-400";

const NavTabs = () => {
  return (
    <nav className="w-1/2 flex flex-row justify-around text-xl mb-15">
      <NavLink
        to={ROUTES.CLOSE_FRIEND}
        className={({ isActive }) => checkIsActive(isActive)}>
        دوستان نزدیک
      </NavLink>
      <span className="text-normal text-gray-500">|</span>
      <NavLink
        to={ROUTES.BLOCK_LIST}
        className={({ isActive }) => checkIsActive(isActive)}>
        لیست سیاه
      </NavLink>
    </nav>
  );
};

export default NavTabs;
