import { useFormik } from "formik";
import * as Yup from "yup";
import usernameIcon from "@assets/icons/username.svg";
import passwordIcon from "@assets/icons/password.svg";
import Button from "@components/Button";
import Input from "@components/Input";
import { Link } from "react-router-dom";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const initialValues: LoginFormValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

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

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <label className="text-sm mb-5">
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
        haveError={!!(formik.touched.username && formik.errors.username)}
        errorMessage={formik.errors.username}
        icon={<img src={usernameIcon} />}
      />

      <Input
        type="password"
        name="password"
        value={formik.values.password}
        placeholder="رمز عبور"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        haveError={!!(formik.touched.password && formik.errors.password)}
        errorMessage={formik.errors.password}
        icon={<img src={passwordIcon} />}
      />

      <div className="flex flex-row-reverse justify-end items-center mt-5">
        <Input
          type="checkbox"
          label={" من را به خاطر بسپار"}
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
          فراموشی رمز عبور
        </Link>
        <Link className="text-sm text-red-400" to="/register">
          ثبت نام در کالج گرام
        </Link>
      </div>
    </form>
  );
};

export default Login;
