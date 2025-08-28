import { Link } from "react-router-dom";

const SwitchTab = () => {
  return (
    <nav className="flex gap-4">
      <Link to="/login">ورود</Link> | <Link to="/register">ثبت نام</Link>
    </nav>
  );
};  

export default SwitchTab;
