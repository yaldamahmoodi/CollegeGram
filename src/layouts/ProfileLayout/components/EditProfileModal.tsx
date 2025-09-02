import React, { useState } from "react";
import { useFormik } from "formik";
import Modal from "@components/Modal";
import Input from "@components/Input";
import passwordIcon from "@assets/icons/password.svg";
import userNameIcon from "@assets/icons/username.svg";
import emailIcon from "@assets/icons/email.svg";
import uploadImageIcon from "@assets/images/uploadImageIcon.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
    },
    onSubmit: (values) => {
      console.log("Form Values:", values);
      console.log("Selected Image:", image);
      onClose();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onPrimaryClick={formik.handleSubmit}
      primaryLabel="ثبت تغیرات"
      secondaryLabel="پشیمون شدم"
      primaryActive={true}
      secondaryActive={true}
      className="w-96">
      <h2 className="text-2xl flex self-center">ویرایش حساب</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="relative w-32 h-32">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border">
                <span className="text-gray-500">آپلود عکس</span>
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
              <img src={uploadImageIcon} alt="Upload" className="w-5 h-5" />
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
          </div>
          {preview && (
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
              className="text-red-500 text-sm underline">
              حذف عکس
            </button>
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

        <Input
          type="text"
          placeholder="بیو"
          name="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </form>
    </Modal>
  );
};

export default EditProfileModal;
