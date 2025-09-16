import { NavLink } from "react-router-dom";

const SwitchTab = () => {
  const checkIsActive = (isActive: boolean) =>
    isActive ? "text-gray-900" : "text-gray-400";

  return (
    <nav className="flex flex-row justify-around text-xl gap-5">
      <NavLink
        to="/login"
        className={({ isActive }) => checkIsActive(isActive)}>
        ورود
      </NavLink>
      <span className="text-normal text-gray-500 mx-2">|</span>
      <NavLink
        to="/register"
        className={({ isActive }) => checkIsActive(isActive)}>
        ثبت نام
      </NavLink>
    </nav>
  );
};

export default SwitchTab;
