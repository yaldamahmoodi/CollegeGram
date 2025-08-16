import React from "react";

type Variant = "danger" | "info" | "primary" | "success";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  success: "bg-green-500 hover:bg-green-600 text-white",
  info: "bg-sky-500 hover:bg-sky-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

function Button({
  label,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-2xl disabled:bg-gray-400 
      ${variantClasses[variant]} ${className}`}>
      {label}
    </button>
  );
}

export default Button;
