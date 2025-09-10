import ImageSlider from "@components/Image.tsx";
import Modal from "@components/Modal.tsx";
import avatar from "@assets/images/avatar.png";
import Button from "@components/Button.tsx";
import edit from "@assets/icons/edit.svg"

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
            <div className="flex flex-col md:flex-row gap-14 pt-12">

                <div className="flex-1">
                    <ImageSlider images={images} />
                </div>

                <div className="flex flex-col gap-12">
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 ">
                            <img
                                src={avatar}
                                alt="mahmz"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="text-2xl font-bold text-right"> mhmz </span>
                        </div>
                        <Button
                            label="ویرایش پست"
                            type="button"
                            icon={<img src={edit} />}
                            className="flex items-center justify-center gap-4"
                        />
                    </div>

                    <p className="text-gray-700 text-right leading-relaxed">
                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. طراحان گرافیک از این متن به عنوان عنصری از ترکیب‌بندی برای پر کردن صفحات استفاده می‌کنند. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطر آنچنان که لازم است.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
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
