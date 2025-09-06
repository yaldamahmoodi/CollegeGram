import React from "react";
import Button from "@components/Button";

type ModalSizeType = "small" | "medium" | "large" | "xLarge" | string;

interface ModalProps {
  isOpen: boolean;
  labelClose?: string;
  labelHandler?: string;
  size?: ModalSizeType;
  children: React.ReactNode;
  className?: string;
  buttonGroupClassName?: string;
  onClose?: () => void;
  onClickHandler?: () => void;
}

const modalSizeClasses: Record<ModalSizeType, string> = {
  small: "w-1/4",
  medium: "w-2/4",
  large: "w-3/4",
};

const Modal = (props: ModalProps) => {
  const {
    isOpen,
    children,
    className,
    buttonGroupClassName,
    labelClose = "پشیمون شدم",
    labelHandler = "click",
    size = "small",
    onClose,
    onClickHandler,
  } = props;

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 `}
      onClick={onClose}>
      <div
        className={`bg-[#f7f7f7] rounded-2xl shadow-lg p-6 flex flex-col gap-4 ${className} ${modalSizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}>
        {children}

        <div className={`flex justify-end gap-2 mt-4 ${buttonGroupClassName}`}>
          {onClose && (
            <Button
              label={labelClose}
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 rounded-2xl"
            />
          )}
          {onClickHandler && (
            <Button
              label={labelHandler}
              type="submit"
              onClick={onClickHandler}
              className="!bg-[#E7000B] !text-white px-4 py-2 rounded-2xl"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
