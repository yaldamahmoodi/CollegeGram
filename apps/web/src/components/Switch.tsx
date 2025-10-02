import { useState } from "react";

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export default function BrownSwitch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(
    checked ?? defaultChecked
  );

  const isControlled = checked !== undefined;

  const toggle = () => {
    if (disabled) return;
    const next = !internalChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <button
        role="switch"
        aria-checked={internalChecked}
        disabled={disabled}
        className={`relative w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none ${
          internalChecked ? "bg-red-700" : "bg-stone-300"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={toggle}>
        <span
          className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
            internalChecked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
