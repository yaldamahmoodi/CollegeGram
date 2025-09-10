import { useState } from "react";
import ImageSlider from "@components/Image.tsx";
import Modal from "@components/Modal.tsx";
import avatar from "@assets/images/avatar.png";
import Button from "@components/Button.tsx";
import edit from "@assets/icons/edit.svg";
import like from "@assets/icons/like.svg";
import save from "@assets/icons/save.svg";
import comment from "@assets/icons/comment.svg";
import modalPost from "@assets/icons/modalPost.svg";
import {useNavigate} from "react-router-dom";

interface PostDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
}

const PostDetailsModal = ({ isOpen, onClose, images }: PostDetailsModalProps) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const [saves, setSaves] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const [comentsCount] = useState(12);
    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };

    const  navigate = useNavigate();

    const  handleCommentClick = () =>{
        navigate("/login")
    }

    const handleSave = () => {
        if (isSaved) {
            setSaves(saves - 1);
        } else {
            setSaves(saves + 1);
        }
        setIsSaved(!isSaved);
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} size="medium">
            <div>
            <img src={modalPost}/>
            </div>
            <div className="flex flex-col md:flex-row gap-14 pt-12">
                <div className="flex-1">
                    <ImageSlider images={images} />
                </div>

                <div className="flex flex-col gap-12">
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                src={avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="text-2xl font-bold text-right">mhmz</span>
                        </div>
                        <Button
                            label="ویرایش پست"
                            type="button"
                            icon={<img src={edit} />}
                            className="flex items-center justify-center gap-4"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs">
                            2 ماه پیش
                        </span>
                        <p className="text-gray-700 text-right leading-relaxed">
                            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.
                            طراحان گرافیک از این متن به عنوان عنصری از ترکیب‌بندی برای پر کردن
                            صفحات استفاده می‌کنند. چاپگرها و متون بلکه روزنامه و مجله در ستون و
                            سطر آنچنان که لازم است.
                        </p>



                    </div>
                    <div className="flex items-center gap-6">
                        <Button
                            type="button"
                            onClick={handleCommentClick}
                            icon={<img src={comment}/>}
                            label={String(comentsCount)}
                            className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                        />

                        <Button
                            type="button"
                            onClick={handleLike}
                            label={String(likes)}
                            icon={<img src={like}/>}
                            className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                        />

                        <Button
                            type="button"
                            onClick={handleSave}
                            icon={<img src={save}/>}
                            label={String(saves)}
                            className="flex flex-col items-center bg-transparent hover:bg-transparent !text-[#EA5A69]"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostDetailsModal;
