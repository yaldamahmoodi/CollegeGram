import groupPhotoIcon from "@assets/icons/GroupPhotos.svg";
import type { ImageGroupProps } from "@/types/post.ts";

const ImageGroup = ({ urls, onClick, showIcon = true, photoCount }: ImageGroupProps) => {
    const list = Array.isArray(urls) ? urls : [urls];
    const safeList = list.filter(Boolean) as string[];

    if (safeList.length === 0) return null;

    const hasMultiple =
        Array.isArray(urls) ? safeList.length > 1 : (photoCount ?? safeList.length) > 1;

    return (
        <div
            className="relative cursor-pointer col-span-12 md:col-span-6 lg:col-span-4"
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : -1}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === " ") onClick();
            }}
        >
            {showIcon && hasMultiple && (
                <img
                    src={groupPhotoIcon}
                    alt="multiple photos"
                    className="absolute top-2 left-2 w-8 h-8 pointer-events-none select-none z-[1]"
                />
            )}

            <img
                src={safeList[0]}
                alt="post thumbnail"
                className="w-full aspect-square object-cover rounded-2xl"
                loading="lazy"
            />
        </div>
    );
};

export default ImageGroup;
