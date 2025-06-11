import Avatar from "@components/avatar/Avatar";
// import Input from '@components/input/Input';
import { useDispatch, useSelector } from "react-redux";
import { Camera, SmilePlus, Users } from "lucide-react";
import "@components/posts/post-form/PostForm.scss";
import { openModal, setModalType } from "@redux/reducers/modal/modal.reducer";
import { useRef, useState } from "react";
import { ImageUtils } from "@services/utils/image-utils.service";
import EditPost from "@components/posts/post-modal/post-edit/EditPost1";
import AddPost from "@components/posts/post-modal/post-add/AddPostGroup";
import AddQuestion from "@components/posts/post-modal/post-add/AddQuestion";
import { Utils } from "@/services/utils/utils.service";

const PostForm = () => {
    const { profile } = useSelector((state) => state.user);
    const { type, isOpen, modalType } = useSelector((state) => state.modal);
    const [_selectedPostImage, setSelectedPostImage] = useState();
    const [_selectedPostVideo, setSelectedPostVideo] = useState();
    const fileInputRef = useRef();
    const videoInputRef = useRef();
    const dispatch = useDispatch();

    const handleVideoFileChange = (event) => {
        ImageUtils.addFileToRedux(
            event,
            "",
            setSelectedPostVideo,
            dispatch,
            "video"
        );
    };

    const openPostModal = () => {
        dispatch(setModalType("createpost"));
        dispatch(openModal({ type: "add", modalType: "createpost" }));
    };

    const openQuestionModal = () => {
        dispatch(setModalType("createquestion"));
        dispatch(openModal({ type: "add", modalType: "createquestion" }));
    };

    const handleFileChange = (event) => {
        ImageUtils.addFileToRedux(
            event,
            "",
            setSelectedPostImage,
            dispatch,
            "image"
        );
    };

    return (
        <>
            <div className="w-full max-w-full px-0 sm:px-0 mt-2 sm:mt-0">
                <div className="w-full max-w-full bg-white rounded-xl shadow-sm px-4 sm:px-6 py-4 border border-gray-50">
                    <div
                        className="flex gap-3 cursor-pointer"
                        onClick={() => openPostModal()}
                    >
                        <Avatar
                            name={profile?.username}
                            bgColor={profile?.avatarColor}
                            textColor="#ffffff"
                            size={40}
                            avatarSrc={profile?.profilePicture}
                        />
                        <div className="flex-grow">
                            <div className="w-full h-10 flex items-center bg-gray-100 rounded-full px-4 py-3 text-gray-500 hover:bg-gray-200 transition-colors duration-200">
                                Share something that you want to share with the group...
                            </div>
                        </div>
                    </div>

                 
                    {/* Hidden file inputs */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        hidden
                        accept="image/*"
                    />
                    <input
                        type="file"
                        ref={videoInputRef}
                        onChange={handleVideoFileChange}
                        hidden
                        accept="video/*"
                    />
                </div>
            </div>

            {/* Modals */}
            {isOpen && type === "add" && modalType === "createpost" && (
                <AddPost />
            )}

            {isOpen && type === "edit" && <EditPost />}
        </>
    );
};
export default PostForm;
