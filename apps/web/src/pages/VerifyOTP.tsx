import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailIcon from "@assets/icons/username.svg";
import passwordIcon from "@assets/icons/password.svg";
import Button from "@components/Button";
import Input from "@components/Input";
import { Link } from "react-router-dom";
import type { VerifyOTPFormValues } from "@app-types/user";
import { useVerifyOTP } from "@/hooks/user.hook";
import { MESSAGES } from "@/const/message";
import { ROUTES } from "@/routes/routes";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const verifyOTPMutation = useVerifyOTP();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, navigate]);

  const initialValues: VerifyOTPFormValues = {
    email: email || "",
    otp: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(MESSAGES.emailRequired)
      .email(MESSAGES.emailInvalid),
    otp: Yup.string()
      .required(MESSAGES.otpRequired)
      .length(6, MESSAGES.otpLength)
      .matches(/^\d{6}$/, MESSAGES.otpNumeric),
  });

  const formik = useFormik<VerifyOTPFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      verifyOTPMutation.mutate(values);
    },
  });

  if (!email) {
    return null;
  }

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <h2 className="text-lg font-semibold mb-2">{MESSAGES.verifyOTPTitle}</h2>
      <label className="text-sm mb-5">{MESSAGES.verifyOTPMessage}</label>

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
        disabled={true}
      />

      <Input
        type="text"
        name="otp"
        value={formik.values.otp}
        placeholder={MESSAGES.otp}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        haveError={!!(formik.touched.otp && formik.errors.otp)}
        errorMessage={formik.errors.otp}
        icon={<img src={passwordIcon} />}
        maxLength={6}
      />

      <Button
        label={MESSAGES.verifyOTPButton}
        disabled={!!Object.keys(formik.errors).length || verifyOTPMutation.isPending}
        className="w-[20px] mt-8 flex self-end"
      />

      <div className="flex flex-col mt-8 gap-3">
        <Link className="text-sm text-red-400" to={ROUTES.FORGOT_PASSWORD}>
          بازگشت به صفحه فراموشی رمز عبور
        </Link>
        <Link className="text-sm text-red-400" to={ROUTES.LOGIN}>
          {MESSAGES.backToLogin}
        </Link>
      </div>
    </form>
  );
};

export default VerifyOTP;
