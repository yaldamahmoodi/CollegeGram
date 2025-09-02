import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import Input from "@/components/Input";
import passwordIcon from "@assets/icons/password.svg";
import userNameIcon from "@assets/icons/username.svg";
import emailIcon from "@assets/icons/email.svg";

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
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <label className="mb-5">
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
        haveError={!!(formik.touched.username && formik.errors.username)}
        errorMessage={formik.errors.username}
      />

      <Input
        type="text"
        placeholder="ایمیل"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={emailIcon} />}
        haveError={!!(formik.touched.email && formik.errors.email)}
        errorMessage={formik.errors.email}
      />

      <Input
        type="password"
        placeholder="رمز عبور"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={passwordIcon} />}
        haveError={!!(formik.touched.password && formik.errors.password)}
        errorMessage={formik.errors.password}
      />

      <Input
        type="password"
        placeholder="تکرار رمز عبور"
        name="confirmPassword"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        icon={<img src={passwordIcon} />}
        haveError={
          !!(formik.touched.confirmPassword && formik.errors.confirmPassword)
        }
        errorMessage={formik.errors.confirmPassword}
      />

      <Button
        label="ثبت نام"
        disabled={!!Object.keys(formik.errors).length}
        className={"mt-8"}
      />
    </form>
  );
};

export default Register;
