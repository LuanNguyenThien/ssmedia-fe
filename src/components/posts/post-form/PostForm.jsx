import Avatar from "@components/avatar/Avatar";
// import Input from '@components/input/Input';
import { useDispatch, useSelector } from "react-redux";
import { Camera, SmilePlus } from "lucide-react";
import "@components/posts/post-form/PostForm.scss";
import {
    openModal,
    toggleFeelingModal,
    toggleGifModal,
    toggleImageModal,
    toggleVideoModal,
} from "@redux/reducers/modal/modal.reducer";
import { useRef, useState } from "react";
import { ImageUtils } from "@services/utils/image-utils.service";
import EditPost from "@components/posts/post-modal/post-edit/EditPost1";
import AddPost from "@components/posts/post-modal/post-add/AddPost";
import AddQuestion from "@components/posts/post-modal/post-add/AddQuestion";

const PostForm = () => {
    const { profile } = useSelector((state) => state.user);
    const {
        type,
        isOpen,
        openFileDialog,
        gifModalIsOpen,
        feelingsIsOpen,
        openVideoDialog,
        modalType,
    } = useSelector((state) => state.modal);
    const [selectedPostImage, setSelectedPostImage] = useState();
    const [selectedPostVideo, setSelectedPostVideo] = useState();
    const fileInputRef = useRef();
    const videoInputRef = useRef();
    const dispatch = useDispatch();

    const openFileVideoInput = () => {
        openVideoModal();
        if (videoInputRef.current) {
            videoInputRef.current.value = null;
        }
    };
    const openFilePictureInput = () => {
        openImageModal();
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };
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
        dispatch(openModal({ type: "add" }));
    };

    const openImageModal = () => {
        fileInputRef.current.click();
        dispatch(openModal({ type: "add" }));
        dispatch(toggleImageModal(!openFileDialog));
    };

    const openVideoModal = () => {
        videoInputRef.current.click();
        dispatch(openModal({ type: "add" }));
        dispatch(toggleVideoModal(!openVideoDialog));
    };

    const openGifModal = () => {
        dispatch(openModal({ type: "add" }));
        dispatch(toggleGifModal(!gifModalIsOpen));
    };

    const openFeelingsComponent = () => {
        dispatch(openModal({ type: "add" }));
        dispatch(toggleFeelingModal(!feelingsIsOpen));
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
            <div className="w-full max-w-full bg-white rounded-3xl shadow-sm px-[25px] py-4 mb-4 ">
                <div
                    className="flex gap-3 mb-4 cursor-pointer"
                    onClick={() => openPostModal()}
                >
                    <Avatar
                        name={profile?.username}
                        bgColor={profile?.avatarColor}
                        textColor="#ffffff"
                        size={50}
                        avatarSrc={profile?.profilePicture}
                    />
                    <div className="flex-grow">
                        <div className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-500">
                            What&apos;s on your mind?
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-start gap-6">
                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center gap-2 text-gray-600 text-sm font-medium px-2 py-1 rounded"
                                onClick={() => {
                                    if (fileInputRef.current)
                                        fileInputRef.current.click();
                                    dispatch(openModal({ type: "add" }));
                                    dispatch(toggleImageModal(!openFileDialog));
                                }}
                            >
                                <Camera className="w-5 h-5 text-blue-600" />
                                <span>Image/Video</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                hidden
                            />
                        </div>

                        <button
                            className="flex items-center gap-2 text-gray-600 text-sm font-medium bg-yellow-100 px-2 py-1 rounded"
                            onClick={openGifModal}
                        >
                            <span className="text-yellow-500 font-bold">
                                GIF
                            </span>
                        </button>

                        <button
                            className="flex items-center gap-2 text-gray-600 text-sm font-medium"
                            onClick={openFeelingsComponent}
                        >
                            <SmilePlus className="w-5 h-5 text-pink-500" />
                            <span>Feeling</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* {isOpen && type === "add" && <ModalManager />} */}
            {isOpen && type === "add" && modalType === "createpost" && (
                <AddPost />
            )}
            {isOpen && type === "add" && modalType === "createquestion" && (
                <AddQuestion />
            )}
            {isOpen && type === "edit" && <EditPost />}
        </>
    );
};
export default PostForm;
