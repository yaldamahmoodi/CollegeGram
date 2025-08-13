import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "./Button";
import Input from "./Input";

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
      [Yup.ref("password"), null],
      "رمز عبور باید با هم مطابقت داشته باشد."
    )
    .required("تکرار رمز عبور الزامی است."),
});

const RegisterForm: React.FC = () => {
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
    <form onSubmit={formik.handleSubmit}>
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
      />
    </form>
  );
};

export default RegisterForm;
