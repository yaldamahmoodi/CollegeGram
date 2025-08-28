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
  icon?: React.ReactNode
  iconPosition?: "right" | "left"
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
  icon,
  iconPosition = "right",
  onChange,
  onBlur,
}) => {
const classNameInput = className
     ? className
        : "flex-1 bg-transparent outline-none px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500";

    return (
        <div className={`flex flex-col gap-1 ${className}`} style={style}>
            {label && (
                <label className="text-sm font-medium text-gray-700">{label}</label>
            )}

            <div className="flex items-center border border-gray-400 rounded-2xl px-2 focus-within:ring-2 focus-within:ring-blue-500">
                {icon && iconPosition === "left" && (
                    <span className="mr-2 text-gray-500">{icon}</span>
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

                {icon && iconPosition === "right" && (
                    <span className="ml-2 text-gray-500">{icon}</span>
                )}
            </div>
        </div>
    );
}

export default Input;
