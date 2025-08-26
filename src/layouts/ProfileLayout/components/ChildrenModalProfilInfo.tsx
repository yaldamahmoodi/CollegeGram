import React, {useState} from "react";
import { useFormik } from "formik";
import Modal from "@/components/Modal.tsx";
import Input from "@/components/Input.tsx";
import userNameIcon from "@/assets/images/userNameIcon.svg";
import emailIcon from "@/assets/images/emailIcon.svg";
import passwordIcon from "@/assets/images/passwordIcon.svg";
import Button from "@/components/Button.tsx";

const  ChilderenModalProfilInfo = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const handleClose = () => setIsOpen(false)

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
            console.log(values);
            setIsOpen(false);
        },
    });


    return(
        <Modal isOpen = {isOpen} onClose = {handleClose}>
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
                        <AiOutlineCamera className="text-white w-5 h-5" />
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
                        className="text-red-500 text-sm underline"
                    >
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
                icon = {<img src={userNameIcon}/> }
                iconPosition = "left"
            />
            {formik.touched.username && formik.errors.username && (
                <div style={{ color: "red" }}>{formik.errors.username}</div>
            )}
            <Input
                type="text"
                placeholder="نام خانوادگی"
                name="lastname"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                icon = {<img src={userNameIcon}/> }
                iconPosition = "left"
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
                icon = {<img src={emailIcon}/> }
                iconPosition = "left"
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
                icon = {<img src={passwordIcon}/> }
                iconPosition = "left"
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
                icon = {<img src={passwordIcon}/> }
                iconPosition = "left"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div style={{ color: "red" }}>{formik.errors.confirmPassword}</div>
            )}

            <div className="flex justify-between gap-2">
                <Button label="پشیمون شدم" onClick={handleClose} />
                <Button label="ثبت تغییرات" onClick={formik.handleSubmit} />
            </div>

        </Modal>
    )
}