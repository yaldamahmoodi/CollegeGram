import Button from "./Button";
import Input from "./Input";
import React from "react";
const RegisterForm = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  return (
    <>
      <label>
        برای ثبت نام کافیه نام کاربری َو ایمیل و رمز عبور رو وارد کنید:{" "}
      </label>

      <Input
        type="text"
        placeholder="نام کاربری"
        value={username}
        onChange={() => {
          setUsername("");
        }}
      />
      <Input
        type="text"
        placeholder="ایمیل"
        value={email}
        onChange={() => {
          setEmail("");
        }}
      />
      <Input
        type="text"
        placeholder="رمز ورود"
        value={password}
        onChange={() => {
          setPassword("");
        }}
      />
      <Input
        type="text"
        placeholder="تکرار رمز ورود"
        value={confirmPassword}
        onChange={() => {
          setConfirmPassword("");
        }}
      />
      <Button
        type="button"
        variant="danger"
        onClick={() => {}}
        label="ثبت نام"
      />
    </>
  );
};

export default RegisterForm;
