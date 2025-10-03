import React, { useEffect } from "react";
import Button from "@components/Button.tsx";

type BottomSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    buttonGroupClassName?: string;
    labelClose?: string;
    labelHandler?: string;
    showCloseButton?: boolean;
    onClickHandler?: () => void;
};

const BottomSheet = (props: BottomSheetProps) => {
    const {
        isOpen,
        onClose,
        children,
        className = "",
        buttonGroupClassName = "",
        labelClose = "پشیمون شدم",
        labelHandler = "click",
        showCloseButton = false,
        onClickHandler,
    } = props;

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] lg:hidden" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50" />

            <div
                role="dialog"
                aria-modal="true"
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl
                    max-h-[80vh] overflow-y-auto transition-transform duration-200 ease-out
                    translate-y-0 px-4 pt-3 pb-4 ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full flex justify-center pb-2">
                    <span className="h-1.5 w-10 bg-gray-300 rounded-full" />
                </div>

                <div>{children}</div>

                {(showCloseButton || onClickHandler) && (
                    <div className={`flex justify-end gap-2 mt-4 ${buttonGroupClassName}`}>
                        {showCloseButton && (
                            <Button
                                label={labelClose}
                                type="button"
                                onClick={onClose}
                                className="border border-gray-300 px-4 py-2 rounded-2xl"
                            />
                        )}
                        {onClickHandler && (
                            <Button
                                label={labelHandler}
                                type="button"
                                onClick={onClickHandler}
                                className="!bg-[#E7000B] !text-white px-4 py-2 rounded-2xl"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomSheet;
