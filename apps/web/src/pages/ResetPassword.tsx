import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import passwordIcon from "@assets/icons/password.svg";
import Button from "@components/Button";
import Input from "@components/Input";
import { Link } from "react-router-dom";
import type { ResetPasswordFormValues } from "@app-types/user";
import { useResetPassword } from "@/hooks/user.hook";
import { MESSAGES } from "@/const/message";
import { ROUTES } from "@/routes/routes";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();

  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  useEffect(() => {
    if (!email || !resetToken) {
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, resetToken, navigate]);

  const initialValues: ResetPasswordFormValues = {
    email: email || "",
    otp: resetToken || "", // otp field now contains resetToken
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().required(), // Hidden field validation
    otp: Yup.string().required(), // Reset token validation (hidden field)
    newPassword: Yup.string()
      .required(MESSAGES.newPasswordRequired)
      .min(8, MESSAGES.passwordMinLength)
      .matches(/[!@#$%^&*(),.?":{}|<>]/, MESSAGES.passwordSpecialChar),
    confirmPassword: Yup.string()
      .required(MESSAGES.confirmPasswordRequired)
      .oneOf([Yup.ref("newPassword")], MESSAGES.confirmPasswordMatch),
  });
  const formik = useFormik<ResetPasswordFormValues>({
    initialValues,
    validationSchema,
    
    onSubmit: ({ confirmPassword, ...payload }) => {
      console.log('Form submission payload:', payload);
      resetPasswordMutation.mutate(payload);
    },
  });

  if (!email || !resetToken) {
    return null;
  }

  // Debug logging
  console.log('ResetPassword Debug:', {
    email,
    resetToken,
    formValues: formik.values,
    formErrors: formik.errors,
    isValid: formik.isValid
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      <h2 className="text-lg font-semibold mb-2">
        {MESSAGES.resetPasswordTitle}
      </h2>
      <label className="text-sm mb-5">
        {MESSAGES.resetPasswordMessage}
        <br />
        <span className="text-xs text-gray-500">برای: {email}</span>
      </label>

      {/* Hidden email field - no need to display since we already have it */}
      <input 
        type="hidden" 
        name="email" 
        value={formik.values.email}
        onChange={formik.handleChange}
      />

      {/* Hidden field for reset token - no need to display */}
      <input 
        type="hidden" 
        name="otp" 
        value={formik.values.otp}
        onChange={formik.handleChange}
      />

      <Input
        type="password"
        name="newPassword"
        value={formik.values.newPassword}
        placeholder={MESSAGES.newPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        haveError={!!(formik.touched.newPassword && formik.errors.newPassword)}
        errorMessage={formik.errors.newPassword}
        icon={<img src={passwordIcon} />}
      />

      <Input
        type="password"
        name="confirmPassword"
        value={formik.values.confirmPassword}
        placeholder={MESSAGES.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        haveError={
          !!(formik.touched.confirmPassword && formik.errors.confirmPassword)
        }
        errorMessage={formik.errors.confirmPassword}
        icon={<img src={passwordIcon} />}
      />

      <Button
        label={MESSAGES.resetPasswordButton}
        disabled={
          !formik.isValid || resetPasswordMutation.isPending
        }
        className="w-[20px] mt-8 flex self-end"
      />

      <div className="flex flex-col mt-8 gap-3">
        <Link
          className="text-sm text-red-400"
          to={ROUTES.VERIFY_OTP}
          state={{ email }}
        >
          بازگشت به صفحه تایید کد
        </Link>
        <Link className="text-sm text-red-400" to={ROUTES.LOGIN}>
          {MESSAGES.backToLogin}
        </Link>
      </div>
    </form>
  );
};

export default ResetPassword;
