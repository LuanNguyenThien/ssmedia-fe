import Avatar from "@components/avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import "@components/posts/post-form/PostForm.scss";
import { openModal } from "@redux/reducers/modal/modal.reducer";
import EditPost from "@components/posts/post-modal/post-edit/EditPost1";
import ModalManager from "../post-modal/post-add/PostTab";
import { setModalType } from "@redux/reducers/modal/modal.reducer";
import { Utils } from "@/services/utils/utils.service";

const PostForm = () => {
    const { profile } = useSelector((state) => state.user);

    const { type, isOpen } = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    const openPostModal = () => {
        dispatch(openModal({ type: "add" }));
    };

    return (
        <>
            <div className="w-full max-w-full px-0 sm:px-0 mt-2 sm:mt-0">
                <div className="w-full max-w-full  bg-white rounded-t-3xl sm:rounded-3xl shadow-sm px-4 sm:px-[25px] py-4 mb-1 sm:mb-4 ">
                    <div
                        className="flex gap-3 mb-4 cursor-pointer"
                        onClick={() => openPostModal()}
                    >
                        <Avatar
                            name={profile?.username}
                            bgColor={profile?.avatarColor}
                            textColor="#ffffff"
                            size={40}
                            avatarSrc={profile?.profilePicture}
                        />
                        <div className="flex-grow ">
                            <div className="w-full h-10 flex items-center bg-gray-100 rounded-full px-4 py-3 text-gray-500">
                                What&apos;s on your mind?
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between font-medium text-sm text-primary/70">
                            {/* <div className="relative">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-gray-600 text-sm font-medium px-2 py-1 rounded"
                                    onClick={() => {
                                        if (fileInputRef.current)
                                            fileInputRef.current.click();
                                        dispatch(openModal({ type: "add" }));
                                        dispatch(
                                            toggleImageModal(!openFileDialog)
                                        );
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
                            </button> */}

                            <div
                                onClick={() => {
                                    dispatch(setModalType("createquestion"));
                                    dispatch(
                                        openModal({
                                            type: "add",
                                            modalType: "createquestion",
                                        })
                                    );
                                }}
                                className="w-full px-4 pt-2 flex items-center justify-center gap-2  hover:scale-110 transition-all duration-300 cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                    />
                                </svg>
                                {Utils.isMobileDevice()
                                    ? "Ask"
                                    : "Ask something?"}
                            </div>

                            <div
                                onClick={() => {
                                    dispatch(setModalType("createpost"));
                                    dispatch(
                                        openModal({
                                            type: "add",
                                            modalType: "createpost",
                                        })
                                    );
                                }}
                                className="border-l w-full px-4 pt-2 flex items-center justify-center gap-2  hover:scale-105 transition-all duration-300  cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                    />
                                </svg>
                                {Utils.isMobileDevice()
                                    ? "Post"
                                    : "Post your thoughts"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && type === "add" && <ModalManager />}
            {/* {isOpen && type === "add" && modalType === "createpost" && (
                <AddPost />
            )}
            {isOpen && type === "add" && modalType === "createquestion" && (
                <AddQuestion />
            )} */}
            {isOpen && type === "edit" && <EditPost />}
        </>
    );
};
export default PostForm;
