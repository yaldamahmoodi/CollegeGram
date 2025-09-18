import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import Input from "@/components/Input";
import passwordIcon from "@assets/icons/password.svg";
import userNameIcon from "@assets/icons/username.svg";
import emailIcon from "@assets/icons/email.svg";
import { useRegister } from "@/hooks/user.hook";
import type { UserRegisterFormValues } from "@app-types/user";
import { MESSAGES } from "@/const/message";

const validationSchema = Yup.object({
  username: Yup.string().required(MESSAGES.usernameRequired),
  email: Yup.string()
    .email(MESSAGES.emailInvalid)
    .required(MESSAGES.emailRequired),
  password: Yup.string()
    .min(8, MESSAGES.passwordMinLength)
    .required(MESSAGES.passwordRequired)
    .matches(/[!@#$%^&*(),.?":{}|<>]/, MESSAGES.passwordSpecialChar),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], MESSAGES.confirmPasswordMatch)
    .required(MESSAGES.confirmPasswordRequired),
});

const Register = () => {
  const registerMutation = useRegister();

  const initialValues: UserRegisterFormValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik<UserRegisterFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...payload } = values;
      registerMutation.mutate(payload);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <label className="text-sm mb-5">{MESSAGES.registerTitleMessage}</label>

      <Input
        type="text"
        placeholder={MESSAGES.username}
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
        placeholder={MESSAGES.email}
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
        placeholder={MESSAGES.password}
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
        placeholder={MESSAGES.confirmPassword}
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
        label={MESSAGES.registerSubmitButton}
        disabled={!!Object.keys(formik.errors).length}
        className={"mt-8"}
      />
    </form>
  );
};

export default Register;
