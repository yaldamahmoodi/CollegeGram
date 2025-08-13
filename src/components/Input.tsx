import React from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string | boolean;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "number" | "checkbox";
  disabled?: boolean;
  className?: string;
  style?: object;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  disabled = false,
  className = "",
  style,
}) => {
  const classNameInput = className
    ? className
    : " bg-white border border-gray-400 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500";
  return (
    <div className={`flex flex-col gap-1 ${className}`} style={style}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        style={style}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={classNameInput}
      />
    </div>
  );
};

export default Input;
