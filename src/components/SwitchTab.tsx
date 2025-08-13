import { Link } from "react-router-dom";

const SwitchTab = () => {
  return (
    <nav>
      <Link to="/login">ورود</Link> | <Link to="/register">ثبت نام</Link>
    </nav>
  );
};

export default SwitchTab;
