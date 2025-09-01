type Variant = "danger" | "info" | "primary" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  success: "bg-green-500 hover:bg-green-600 text-white",
  info: "bg-sky-500 hover:bg-sky-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

const Button = (props: ButtonProps) => {
  const { variant = "danger", label, className } = props;
  const defaultClassname =
    "text-sm rounded-3xl px-8 py-3  w-auto self-end min-w-[84px]";
  return (
    <button
      className={`${defaultClassname} ${className} ${variantClasses[variant]}`}>
      {label}
    </button>
  );
};

export default Button;
