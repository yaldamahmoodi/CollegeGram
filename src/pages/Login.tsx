import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserLoginType {
  username: string;
  password: string;
  rememberMe: boolean;
}

type userLoginPayload = Omit<UserLoginType, "rememberMe">;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("نام کاربری الزامی است")
      .min(8, "حداقل 8 کاراکتر"),
    password: Yup.string()
      .required("رمز ورود الزامی است")
      .min(8, "حداقل 8 کاراکتر")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "نام کاربری باید حداقل یک کاراکتر خاص داشته باشد"
      ),
  });

  const userLoginReguest = async (payload: userLoginPayload) => {
    const { data } = await axios.post(
      "http://130.185.75.174:3001/api/v1/auth/login",
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
    mutationFn: userLoginReguest,
    onSuccess: (data) => {
      console.log("success: ", data);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("error:", error.message);
    },
  });

  const initialValues: UserLoginType = {
    username: "",
    password: "",
    rememberMe: false,
  };

  const formik = useFormik<UserLoginType>({
    initialValues,
    validationSchema,
    onSubmit: ({ username, password }) => {
      mutation.mutate({ username, password });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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
      />

      {formik.touched.password && formik.errors.password && (
        <div style={{ color: "red" }}>{formik.errors.password}</div>
      )}

      <Input
        label="من را به خاطر بس‍پر"
        type="checkbox"
        name="rememberMe"
        checked={formik.values.rememberMe}
        onChange={formik.handleChange}
      />

      <Button
        label="ورود"
        variant="danger"
        type="submit"
        disabled={!!Object.keys(formik.errors).length}
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
