import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import Input from "@/components/Input";
import passwordIcon from "@/assets/icons/passwordIcon.svg";
import userNameIcon from "@/assets/icons/userNameIcon.svg";
import emailIcon from "@/assets/icons/emailIcon.svg";

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required("نام کاربری الزامی است."),
  email: Yup.string()
    .email("ایمیل معتبر وارد کنید.")
    .required("ایمیل الزامی است."),
  password: Yup.string()
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد.")
    .required("رمز عبور الزامی است."),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), undefined],
      "رمز عبور باید با هم مطابقت داشته باشد."
    )
    .required("تکرار رمز عبور الزامی است."),
});

const Register: React.FC = () => {
  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <label>
        برای ثبت نام کافیه نام کاربری َو ایمیل و رمز عبور رو وارد کنید:{" "}
      </label>

      <Input
        type="text"
        placeholder="نام کاربری"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={userNameIcon} />}
        iconPosition="left"
      />
      {formik.touched.username && formik.errors.username && (
        <div style={{ color: "red" }}>{formik.errors.username}</div>
      )}

      <Input
        type="text"
        placeholder="ایمیل"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={emailIcon} />}
        iconPosition="left"
      />
      {formik.touched.email && formik.errors.email && (
        <div style={{ color: "red" }}>{formik.errors.email}</div>
      )}

      <Input
        type="password"
        placeholder="رمز ورود"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={passwordIcon} />}
        iconPosition="left"
      />
      {formik.touched.password && formik.errors.password && (
        <div style={{ color: "red" }}>{formik.errors.password}</div>
      )}

      <Input
        type="password"
        placeholder="تکرار رمز ورود"
        name="confirmPassword"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={passwordIcon} />}
        iconPosition="left"
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <div style={{ color: "red" }}>{formik.errors.confirmPassword}</div>
      )}

      <Button
        type="submit"
        variant="danger"
        label="ثبت نام"
        onClick={() => {}}
        disabled={!!Object.keys(formik.errors).length}
        className="h-9 w-21 self-end"
      />
    </form>
  );
};

export default Register;
