import React from "react";
import Button from "@components/Button";

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    onPrimaryClick?: () => void;
    children: React.ReactNode;
    className?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    primaryActive?: boolean;
    secondaryActive?: boolean;
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         onPrimaryClick,
                                         children,
                                         className,
                                         primaryLabel = "",
                                         secondaryLabel = "",
                                         primaryActive = true,
                                         secondaryActive = true,
                                     }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className={`bg-[#f7f7f7] rounded-2xl shadow-lg p-6 flex flex-col gap-4 ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}

                {(primaryActive || secondaryActive) && (
                    <div className="flex justify-end gap-2 mt-4">
                        {secondaryActive && (
                            <Button
                                label={secondaryLabel}
                                type="button"
                                onClick={onClose}
                                className="bg-transparent !text-black border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        )}
                        {primaryActive && (
                            <Button
                                label={primaryLabel}
                                type="submit"
                                onClick={onPrimaryClick}
                                className="!bg-[#E7000B] !text-white px-4 py-2 rounded-2xl"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
