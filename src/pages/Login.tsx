import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userNameIcon from "../assets/icons/userNameIcon.svg";
import passwordIcon from "../assets/icons/passwordIcon.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const initialValues: LoginFormValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("نام کاربری الزامی است")
      .min(8, "حداقل 8 کاراکتر")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "نام کاربری باید حداقل یک کاراکتر خاص داشته باشد"
      ),
    password: Yup.string()
      .required("رمز ورود الزامی است")
      .min(8, "حداقل 8 کاراکتر"),
  });

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <label>
        به کالج گرام خوش آمدید. برای ورود کافیه نام کاربری/ایمیل و رمز عبور
        خودتون رو وارد کنید:
      </label>

      <Input
        type="text"
        name="username"
        value={formik.values.username}
        placeholder="نام کاربری"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={userNameIcon} />}
        iconPosition="left"
      />
      {formik.touched.username && formik.errors.username && (
        <div style={{ color: "red" }}>{formik.errors.username}</div>
      )}

      <Input
        type="password"
        name="password"
        value={formik.values.password}
        placeholder="رمز ورود"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={passwordIcon} />}
        iconPosition="left"
      />

      {formik.touched.password && formik.errors.password && (
        <div style={{ color: "red" }}>{formik.errors.password}</div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="rememberMe"
          id="rememberMe"
          checked={formik.values.rememberMe}
          onChange={formik.handleChange}
          className="w-4 h-4 cursor-pointer accent-red-600"
        />
        <label
          htmlFor="rememberMe"
          className="text-sm text-gray-700 cursor-pointer">
          من را به خاطر بس‍پر
        </label>
      </div>

      <Button
        label="ورود"
        variant="danger"
        type="submit"
        disabled={!!Object.keys(formik.errors).length}
        className="h-9 w-21 self-end"
      />

      <div style={{ marginTop: "10px" }}>
        <a href="#">فراموشی رمز ورود</a>
        <br />
        <a href="#">ثبت نام در کالج گرام</a>
      </div>
    </form>
  );
};

export default Login;
