import { useEffect, useState } from "react";
import { toastManager } from "@/utils/toastManager";
import type { ToastMessage } from "@/utils/toastManager";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const renderIcon = (type: string) => {
    if (type === "success") {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    } else if (type === "error") {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="8" />
        </svg>
      );
    }
  };

  return (
    <div className="fixed top-4 right-4 space-y-4 z-50">
      {toasts.map((toast) => {
        let bgColor = "bg-blue-500";
        if (toast.type === "error") bgColor = "bg-red-600";
        else if (toast.type === "success") bgColor = "bg-green-600";

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl text-white text-lg ${bgColor} animate-slideIn`}>
            {renderIcon(toast.type)}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
