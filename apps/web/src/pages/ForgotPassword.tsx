import { useFormik } from "formik";
import * as Yup from "yup";
import emailIcon from "@assets/icons/username.svg";
import Button from "@components/Button";
import Input from "@components/Input";
import { Link } from "react-router-dom";
import type { ForgotPasswordFormValues } from "@app-types/user";
import { useForgotPassword } from "@/hooks/user.hook";
import { MESSAGES } from "@/const/message";
import { ROUTES } from "@/routes/routes";

const ForgotPassword = () => {
  const forgotPasswordMutation = useForgotPassword();

  const initialValues: ForgotPasswordFormValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(MESSAGES.emailRequired)
      .email(MESSAGES.emailInvalid),
  });

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      forgotPasswordMutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <h2 className="text-lg font-semibold mb-2">{MESSAGES.forgotPasswordTitle}</h2>
      <label className="text-sm mb-5">{MESSAGES.forgotPasswordMessage}</label>

      <Input
        type="email"
        name="email"
        value={formik.values.email}
        placeholder={MESSAGES.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        haveError={!!(formik.touched.email && formik.errors.email)}
        errorMessage={formik.errors.email}
        icon={<img src={emailIcon} />}
      />

      <Button
        label={MESSAGES.sendOTPButton}
        disabled={!!Object.keys(formik.errors).length || forgotPasswordMutation.isPending}
        className="w-[20px] mt-8 flex self-end"
      />

      <div className="flex flex-col mt-8 gap-3">
        <Link className="text-sm text-red-400" to={ROUTES.LOGIN}>
          {MESSAGES.backToLogin}
        </Link>
        <Link className="text-sm text-red-400" to={ROUTES.REGISTER}>
          {MESSAGES.registerInCollegeGeram}
        </Link>
      </div>
    </form>
  );
};

export default ForgotPassword;
