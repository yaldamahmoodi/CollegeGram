import Button from "@/components/Button";
import Input from "@/components/Input";
import React from "react";
const LoginForm = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  return (
    <>
      <label>
        به کالج گرام خوش آمدید.برای ورود کافیه نام کاربری/ایمیل و رمز عبور
        خودتون رو وارد کنید:
      </label>
      <Input
        type="text"
        value={username}
        placeholder="نام کاربری"
        onChange={() => setUsername("dsdcas")}
      />
      <Input
        type="text"
        value={password}
        placeholder="رمز ورود"
        onChange={() => setPassword("dsadsad")}
      />
      <Input
        label="من را به خاطر بس‍پر "
        type="checkbox"
        value={rememberMe}
        onChange={() => setRememberMe(true)}
      />

      <Button label="ورود" variant="danger" onClick={() => {}} />

      <a href="#">فراموشی رمز ورود</a>
      <a href="#"> ثبت نام در کالج گرام </a>
    </>
  );
};

export default LoginForm;
