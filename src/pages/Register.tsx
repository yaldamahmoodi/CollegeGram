import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserRegisterType {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type userPayloadType = Omit<UserRegisterType, "confirmPassword">;

const Register: React.FC = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("نام کاربری الزامی است.")
      .min(5, "نام کاربری باید حداقل 5 کاراکتر باشد."),
    email: Yup.string()
      .email("ایمیل معتبر وارد کنید.")
      .required("ایمیل الزامی است."),
    password: Yup.string()
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد.")
      .required("رمز عبور الزامی است.")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "رمز ورود باید حداقل یک کاراکتر خاص داشته باشد"
      ),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "رمز عبور باید با هم مطابقت داشته باشد."
      )
      .required("تکرار رمز عبور الزامی است."),
  });

  const initialValues: UserRegisterType = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik<UserRegisterType>({
    initialValues,
    validationSchema,
    onSubmit: ({ username, password, email }) => {
      mutation.mutate({ username, password, email });
    },
  });

  const userRegisterRequest = async (payload: userPayloadType) => {
    const { data } = await axios.post(
      "http://130.185.75.174:3001/api/v1/auth/register",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };

  const mutation = useMutation({
    mutationFn: userRegisterRequest,
    onSuccess: (data) => {
      console.log("success: ", data);
      navigate("/login");
    },
    onError: (error) => {
      console.error("error:", error.message);
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
        disabled={!formik.isValid || formik.isSubmitting}
      />
    </form>
  );
};

export default Register;
