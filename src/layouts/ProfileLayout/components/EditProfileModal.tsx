import React, { useState } from "react";
import { useFormik } from "formik";
import Modal from "@components/Modal";
import Input from "@components/Input";
import passwordIcon from "@assets/icons/password.svg";
import userNameIcon from "@assets/icons/username.svg";
import emailIcon from "@assets/icons/email.svg";
import uploadImageIcon from "@assets/images/uploadImageIcon.svg";
import refreshIcon from "@assets/icons/refresh.svg";
import { updateProfile, uploadProfileImage, type UpdateProfilePayload } from "@/api/user/user.api";
import Button from "@components/Button";

type FormValues = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    bio: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);


    const formik = useFormik<FormValues>({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
    },
        onSubmit: async (values, { setFieldError }) => {
            const { confirmPassword, bio, ...rest } = values;
            if (rest.password && rest.password !== confirmPassword) {
                setFieldError("confirmPassword", "تکرار رمز با رمز برابر نیست");
                return;
            }
            const raw = { ...rest, biography: bio };
            const payload: UpdateProfilePayload = Object.fromEntries(
                Object.entries(raw).filter(([, v]) => v != null && String(v).trim() !== "")
            ) as UpdateProfilePayload;
            if (Object.keys(payload).length > 0) {
                await updateProfile(payload);
            }
            if (image) {
                await uploadProfileImage(image);
            }
            if (Object.keys(payload).length === 0 && !image) {
                onClose();
                return;
            }
            onClose();
            },
  });

  return (
      <Modal
          isOpen={isOpen}
          onClose={onClose}
          onClickHandler={() => {
              if (!formik.isSubmitting) formik.submitForm();
          }}
          labelHandler={formik.isSubmitting ? "در حال ذخیره..." : "ثبت تغییرات"}
          labelClose="پشیمون شدم"
          className="w-96">
      <h2 className="text-2xl flex self-center">ویرایش حساب</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex flex-col self-center items-center gap-2 mb-4 rounded-full overflow-hidden w-32 h-32  cursor-pointer justify-center hover:bg-orange-50 transition">
              <label>
                  {!preview && (
                      <img
                          src={uploadImageIcon}
                          alt="Upload"
                      />
                  )}

                  {preview && (
                      <img
                          src={preview}
                          alt="Profile Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                      />
                  )}

                  <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                              setImage(file);
                              setPreview(URL.createObjectURL(file));
                          }
                      }}
                  />
              </label>

              {preview && (
                    <img src={refreshIcon} className="absolute top-1/2"/>
              )}
          </div>


        <Input
          type="text"
          placeholder="نام"
          name="firstname"
          value={formik.values.firstname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<img src={userNameIcon} />}
          haveError={!!(formik.touched.firstname && formik.errors.firstname)}
          errorMessage={formik.errors.firstname}
        />

        <Input
          type="text"
          placeholder="نام خانوادگی"
          name="lastname"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<img src={userNameIcon} />}
          haveError={!!(formik.touched.lastname && formik.errors.lastname)}
          errorMessage={formik.errors.lastname}
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
          placeholder="رمز ورود"
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
          placeholder="تکرار رمز ورود"
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
          <div className="flex items-center gap-2">
              <Button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${isPrivate ? "bg-[#E7000B]" : "bg-gray-300"}`}
                  label={
                      <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
              ${isPrivate ? "translate-x-5" : "translate-x-0"}`}
                      />
                  }
              />
              <span className="text-sm select-none">پیج خصوصی باشه</span>

          </div>

          <div className="flex flex-col gap-2">
            <p>بایو</p>
        <Input
          type="text"
          multiple
          name="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full h-20 bg-white rounded-lg border border-gray-300 p-3 resize-none"
        />
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
