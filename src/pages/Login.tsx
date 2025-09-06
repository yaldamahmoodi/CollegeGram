import { useFormik } from "formik";
import * as Yup from "yup";
import usernameIcon from "@assets/icons/username.svg";
import passwordIcon from "@assets/icons/password.svg";
import Button from "@components/Button";
import Input from "@components/Input";
import { Link } from "react-router-dom";
import type { LoginFormValues } from "@app-types/user";
import { useLogin } from "@/hooks/user.hook";
import { MESSAGES } from "@/const/message";

const Login = () => {
  const registerMutation = useLogin();

  const initialValues: LoginFormValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    username: Yup.string().required(MESSAGES.usernameRequired),
    password: Yup.string()
      .required(MESSAGES.passwordRequired)
      .min(6, MESSAGES.passwordMinLength)
      .matches(/[!@#$%^&*(),.?":{}|<>]/, MESSAGES.passwordSpecialChar),
  });

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { rememberMe, ...payload } = values;
      registerMutation.mutate(payload);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <label className="text-sm mb-5">{MESSAGES.loginTitleMessage}</label>

      <Input
        type="text"
        name="username"
        value={formik.values.username}
        placeholder={MESSAGES.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        haveError={!!(formik.touched.username && formik.errors.username)}
        errorMessage={formik.errors.username}
        icon={<img src={usernameIcon} />}
      />

      <Input
        type="password"
        name="password"
        value={formik.values.password}
        placeholder={MESSAGES.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        haveError={!!(formik.touched.password && formik.errors.password)}
        errorMessage={formik.errors.password}
        icon={<img src={passwordIcon} />}
      />

      <div className="flex flex-row-reverse justify-end items-center mt-5">
        <Input
          type="checkbox"
          label={MESSAGES.rememberMe}
          className="text-sm text-gray-700 cursor-pointer mr-2 flex flex-row items-center"
          checked={formik.values.rememberMe}
          onChange={formik.handleChange}
        />
      </div>

      <Button
        label="ورود"
        disabled={!!Object.keys(formik.errors).length}
        className="mt-8"
      />

      <div className="flex flex-col mt-8 gap-3">
        <Link className="text-sm text-red-400" to="/">
          {MESSAGES.forgetPassword}
        </Link>
        <Link className="text-sm text-red-400" to="/register">
          {MESSAGES.registerInCollegeGeram}
        </Link>
      </div>
    </form>
  );
};

export default Login;
