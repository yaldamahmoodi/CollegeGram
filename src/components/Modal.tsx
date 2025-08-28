import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose} // کلیک روی پس‌زمینه مدال
    >
      <div
        className="w-[500px] bg-[#f7f7f7] rounded-2xl shadow-lg p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن روی محتوای مدال
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
