import ImageSlider from "@components/Image.tsx";
import Modal from "@components/Modal.tsx";

interface PostDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
}

const PostDetailsModal = ({
                              isOpen,
                              onClose,
                              images,
                          }: PostDetailsModalProps) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="medium"
            labelClose="✕"
        >
            <div className="flex flex-col md:flex-row gap-6">

                {/* اسلایدر تصاویر */}
                <div className="flex-1">
                    <ImageSlider images={images} />
                </div>

                {/* اطلاعات پست */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* عنوان لورم */}
                    <h2 className="text-2xl font-bold text-right">
mhmz                    </h2>

                    {/* کاربر لورمی */}
                    <div className="flex items-center gap-2 self-end">
                        <span className="text-sm text-gray-600"></span>
                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="mahmz"
                            className="w-8 h-8 rounded-full"
                        />
                    </div>

                    {/* توضیحات لورمی */}
                    <p className="text-gray-700 text-right leading-relaxed">
                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. طراحان گرافیک از این متن به عنوان عنصری از ترکیب‌بندی برای پر کردن صفحات استفاده می‌کنند. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطر آنچنان که لازم است.
                    </p>

                    {/* تگ‌های فرضی */}
                    <div className="flex flex-wrap gap-2 mt-2 self-end">
                        {["قدرت", "جامعه", "ترس"].map((tag, index) => (
                            <span
                                key={index}
                                className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostDetailsModal;
