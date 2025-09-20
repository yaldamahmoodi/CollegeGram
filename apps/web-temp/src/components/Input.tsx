import React from "react";
import ValidationErrorIcon from "@assets/icons/validationError.svg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  haveError?: boolean;
  errorMessage?: string;
}

const Input = (props: InputProps) => {
  const {
    label,
    icon,
    className,
    haveError = false,
    errorMessage,
    ...rest
  } = props;

  const classNameInput = className
    ? className
    : "flex items-center bg-white border rounded-3xl px-3 py-2 mt-4 mb-1 disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <>
      {label && (
        <span className="flex flex-col text-sm text-gray-700 mr-2">
          {label}
        </span>
      )}
      <div
        className={`${classNameInput} ${
          haveError ? "border-red-400" : "border-gray-400"
        }`}>
        {icon && <span className="mx-2 text-gray-500">{icon}</span>}
        <input
          {...rest}
          className="focus:outline-none focuse:border-0 w-full pl-5 pr-1"
        />
      </div>
      {haveError && errorMessage && (
        <div className="flex flex-row items-center mx-5">
          <img src={ValidationErrorIcon} />
          <span className="text-sm text-red-500 mr-2">{errorMessage}</span>
        </div>
      )}
    </>
  );
};

export default Input;
