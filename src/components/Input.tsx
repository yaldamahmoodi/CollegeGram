import React from "react";

interface InputProps {
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "email" | "password" | "number" | "checkbox";
  disabled?: boolean;
  checked?: boolean;
  className?: string;
  style?: object;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  placeholder = "",
  value,
  type = "text",
  disabled = false,
  className = "",
  checked = false,
  style,
  onChange,
  onBlur,
}) => {
  const classNameInput = className
    ? className
    : "bg-white border border-gray-400 rounded-2xl px-3 py-2 my-2 my-focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <div className={`flex flex-col gap-1 ${className}`} style={style}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={type === "checkbox" ? undefined : value}
        checked={type === "checkbox" ? checked : undefined}
        disabled={disabled}
        className={classNameInput}
        style={style}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default Input;
