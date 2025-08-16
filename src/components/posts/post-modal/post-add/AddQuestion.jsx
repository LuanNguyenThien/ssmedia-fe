import PostWrapper from "@components/posts/modal-wrappers/post-wrapper/PostWrapper";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "@components/posts/post-modal/post-add/AddPost.scss";
import ModalBoxContent from "@components/posts/post-modal/modal-box-content/ModalBoxContent";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { bgColors } from "@services/utils/static.data";
import ModalBoxSelection from "@components/posts/post-modal/modal-box-content/ModalBoxSelection";
import Button from "@components/button/Button";
import { PostUtils } from "@services/utils/post-utils.service";
import {
    closeModal,
    toggleGifModal,
} from "@redux/reducers/modal/modal.reducer";
import Giphy from "@components/giphy/Giphy";
import PropTypes from "prop-types";
import { ImageUtils } from "@services/utils/image-utils.service";
import { postService } from "@services/api/post/post.service";
import Spinner from "@components/spinner/Spinner";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import TabsBar from "./components/TabsBar";
const AddQuestion = ({ selectedImage, selectedPostVideo }) => {
    const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
    const { gifUrl, image, privacy, video } = useSelector(
        (state) => state.post
    );
    const { profile } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [hasVideo, setHasVideo] = useState(false);
    const [postImage, setPostImage] = useState("");
    const [allowedNumberOfCharacters] = useState("1000/1000");
    const [textAreaBackground, setTextAreaBackground] = useState("#ffffff");
    const [postData, setPostData] = useState({
        post: "",
        bgColor: textAreaBackground,
        privacy: "",
        feelings: "",
        gifUrl: "",
        profilePicture: "",
        image: "",
        video: "",
    });
    const [disable, setDisable] = useState(true);
    const [apiResponse, setApiResponse] = useState("");
    const [selectedPostImage, setSelectedPostImage] = useState();
    const [selectedVideo, setSelectedVideo] = useState();
    const counterRef = useRef(null);
    const inputRef = useRef(null);
    const imageInputRef = useRef(null);
    const dispatch = useDispatch();
    const maxNumberOfCharacters = 1000;

    const selectBackground = (bgColor) => {
        PostUtils.selectBackground(
            bgColor,
            postData,
            setTextAreaBackground,
            setPostData
        );
    };

    const onPaste = (event) => {
        const pastedText = event.clipboardData.getData("Text");
        const currentTextLength = event.target.textContent.length;
        const counter = maxNumberOfCharacters - currentTextLength;
        if (pastedText.length > counter) {
            event.preventDefault();
        }
    };
    const postInputEditable = (event) => {
        const currentTextLength = event.target.textContent.length;
        const counter = maxNumberOfCharacters - currentTextLength;
        counterRef.current.textContent = `${counter}/1000`;
        setDisable(currentTextLength <= 0 && !postImage);
        PostUtils.postInputEditable(
            event.target.textContent,
            postData,
            setPostData
        );
    };

    const closePostModal = () => {
        PostUtils.closePostModal(dispatch);
    };

    const onKeyDown = (event) => {
        const currentTextLength = event.target.textContent.length;
        if (currentTextLength >= maxNumberOfCharacters && event.keyCode !== 8) {
            event.preventDefault();
        }
    };

    const clearImage = () => {
        setSelectedVideo(null);
        PostUtils.clearImage(
            postData,
            "",
            inputRef,
            dispatch,
            setSelectedPostImage,
            setPostImage,
            setPostData
        );
    };

    const createPost = async () => {
        setLoading(!loading);
        setDisable(!disable);
        try {
            if (Object.keys(feeling).length) {
                postData.feelings = feeling?.name;
            }
            postData.privacy = privacy || "Public";
            postData.gifUrl = gifUrl;
            postData.profilePicture = profile?.profilePicture;
            if (
                selectedPostImage ||
                selectedVideo ||
                selectedImage ||
                selectedPostVideo
            ) {
                let result = "";
                if (selectedPostImage) {
                    result = await ImageUtils.readAsBase64(selectedPostImage);
                }

                if (selectedVideo) {
                    result = await ImageUtils.readAsBase64(selectedVideo);
                }

                if (selectedImage) {
                    result = await ImageUtils.readAsBase64(selectedImage);
                }

                if (selectedPostVideo) {
                    result = await ImageUtils.readAsBase64(selectedPostVideo);
                }
                const type =
                    selectedPostImage || selectedImage ? "image" : "video";
                if (type === "image") {
                    postData.image = result;
                    postData.video = "";
                } else {
                    postData.video = result;
                    postData.image = "";
                }
                const response = await PostUtils.sendPostWithFileRequest(
                    type,
                    postData,
                    imageInputRef,
                    setApiResponse,
                    setLoading,
                    setDisable,
                    dispatch
                );
                if (response && response?.data?.message) {
                    setHasVideo(false);
                    PostUtils.closePostModal(dispatch);
                }
            } else {
                const response = await postService.createPost(postData);
                if (response) {
                    setApiResponse("success");
                    setLoading(false);
                    setHasVideo(false);
                    PostUtils.closePostModal(dispatch);
                }
            }
        } catch (error) {
            setHasVideo(false);
            PostUtils.dispatchNotification(
                error.response.data.message,
                "error",
                setApiResponse,
                setLoading,
                dispatch
            );
        }
    };

    useEffect(() => {
        PostUtils.positionCursor("editable");
    }, []);

    useEffect(() => {
        if (!loading && apiResponse === "success") {
            dispatch(closeModal());
        }
        setDisable(postData.post.length <= 0 && !postImage);
    }, [loading, dispatch, apiResponse, postData, postImage]);

    useEffect(() => {
        if (gifUrl) {
            setPostImage(gifUrl);
            setHasVideo(false);
            PostUtils.postInputData(imageInputRef, postData, "", setPostData);
        } else if (image) {
            setPostImage(image);
            setHasVideo(false);
            PostUtils.postInputData(imageInputRef, postData, "", setPostData);
        } else if (video) {
            setHasVideo(true);
            setPostImage(video);
            PostUtils.postInputData(imageInputRef, postData, "", setPostData);
        }
    }, [gifUrl, image, postData, video]);

    return (
        <>
            <PostWrapper>
                <div></div>
                {!gifModalIsOpen && (
                    <div className="modal-box !w-screen !h-[90vh] sm:!h-[80vh] flex flex-col">
                        {loading && (
                            <div
                                className="modal-box-loading"
                                data-testid="modal-box-loading"
                            >
                                <span>Posting...</span>
                                <Spinner />
                            </div>
                        )}
                        <TabsBar closePostModal={closePostModal} />
                        <ModalBoxContent />

                        <div className="flex-1 overflow-auto">
                            {!postImage && (
                                <>
                                    <div
                                        className="modal-box-form h-full px-4"
                                        data-testid="modal-box-form"
                                        style={{
                                            background: `${textAreaBackground}`,
                                        }}
                                    >
                                        <div
                                            className="main h-full"
                                            style={{
                                                margin:
                                                    textAreaBackground !==
                                                    "#ffffff"
                                                        ? "0 auto"
                                                        : "",
                                            }}
                                        >
                                            <div className="flex-row h-full">
                                                <div
                                                    data-testid="editable"
                                                    id="editable"
                                                    name="post"
                                                    ref={(el) => {
                                                        inputRef.current = el;
                                                        inputRef?.current?.focus();
                                                    }}
                                                    className={`editable flex-item h-full ${
                                                        textAreaBackground !==
                                                        "#ffffff"
                                                            ? "textInputColor"
                                                            : ""
                                                    } ${
                                                        postData.post.length ===
                                                            0 &&
                                                        textAreaBackground !==
                                                            "#ffffff"
                                                            ? "defaultInputTextColor"
                                                            : ""
                                                    }`}
                                                    contentEditable={true}
                                                    onInput={postInputEditable}
                                                    onKeyDown={onKeyDown}
                                                    onPaste={onPaste}
                                                    data-placeholder="What's on your mind?..."
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {postImage && (
                                <>
                                    <div className="modal-box-image-form h-full">
                                        <div
                                            data-testid="post-editable"
                                            name="post"
                                            id="editable"
                                            ref={(el) => {
                                                imageInputRef.current = el;
                                                imageInputRef?.current?.focus();
                                            }}
                                            className="post-input flex-item"
                                            contentEditable={true}
                                            onInput={postInputEditable}
                                            onKeyDown={onKeyDown}
                                            data-placeholder="What's on your mind?..."
                                        ></div>
                                        <div className="image-display">
                                            <div
                                                className="image-delete-btnn z-[10] p-2 cursor-pointer hover:text-red-200  absolute -top-0 right-[10px] left-auto bg-black/50 text-primary-white rounded-full flex place-content-center"
                                                data-testid="image-delete-btn"
                                                style={{
                                                    marginTop: `${
                                                        hasVideo ? "-40px" : ""
                                                    }`,
                                                }}
                                                onClick={() => clearImage()}
                                            >
                                                <FaTimes />
                                            </div>
                                            {!hasVideo && (
                                                <img
                                                    data-testid="post-image"
                                                    className="post-image"
                                                    src={`${postImage}`}
                                                    alt=""
                                                />
                                            )}
                                            {hasVideo && (
                                                <div
                                                    style={{
                                                        marginTop: "-40px",
                                                    }}
                                                >
                                                    <video
                                                        width="100%"
                                                        controls
                                                        src={`${video}`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <span
                            className="char_count w-full flex justify-end px-4 "
                            data-testid="allowed-number"
                            ref={counterRef}
                        >
                            {allowedNumberOfCharacters}
                        </span>
                        <div className="flex justify-between items-center px-4 pt-2 sm:py-3 border-t border-gray-200 bg-white">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1  sm:gap-4 w-full">
                                <div className="modal-box-bg-colors">
                                    <ul className="flex items-center justify-center">
                                        {bgColors.map((color, index) => (
                                            <li
                                                data-testid="bg-colors"
                                                key={index}
                                                className={`${
                                                    color === "#ffffff"
                                                        ? "whiteColorBorder"
                                                        : ""
                                                }`}
                                                style={{
                                                    backgroundColor: `${color}`,
                                                }}
                                                onClick={() => {
                                                    PostUtils.positionCursor(
                                                        "editable"
                                                    );
                                                    selectBackground(color);
                                                }}
                                            ></li>
                                        ))}
                                    </ul>
                                </div>

                                <ModalBoxSelection
                                    setSelectedPostImage={setSelectedPostImage}
                                    setSelectedVideo={setSelectedVideo}
                                />
                            </div>
                        </div>

                        <div
                            className="h-[10%] px-2 w-full py-2"
                            data-testid="edit-button"
                        >
                            <button
                                disabled={disable}
                                onClick={() => createPost()}
                                className={`cursor-pointer max-w-[100vw] size-full bg-primary hover:bg-primary-dark transition-colors flex justify-center items-center rounded-[15px] px-4 py-2 text-white ${
                                    disable
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                data-testid="edit-button"
                            >
                                <Button
                                    label="Create question"
                                    className="post-button"
                                    disabled={disable}
                                    // handleClick={updatePost}
                                />
                            </button>
                        </div>
                    </div>
                )}
                {gifModalIsOpen && (
                    <div className="modal-giphy" data-testid="modal-giphy">
                        <div className="modal-giphy-header flex justify-between items-center">
                            <Button
                                label={<FaArrowLeft />}
                                className="back-button"
                                disabled={false}
                                handleClick={() =>
                                    dispatch(toggleGifModal(!gifModalIsOpen))
                                }
                            />
                            <h2 className="text-lg font-semibold w-max">
                                Choose a GIF
                            </h2>
                        </div>
                        <hr />
                        <Giphy />
                    </div>
                )}
            </PostWrapper>
        </>
    );
};
AddQuestion.propTypes = {
    selectedImage: PropTypes.any,
    selectedPostVideo: PropTypes.any,
};
export default AddQuestion;
