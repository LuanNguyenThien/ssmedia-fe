import PostWrapper from "@components/posts/modal-wrappers/post-wrapper/PostWrapper";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "@components/posts/post-modal/post-edit/EditPost.scss";
import ModalBoxContent from "@components/posts/post-modal/modal-box-content/ModalBoxContent";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { bgColors, feelingsList } from "@services/utils/static.data";
import ModalBoxSelection from "@components/posts/post-modal/modal-box-content/ModalBoxSelection";
import Button from "@components/button/Button";
import { PostUtils } from "@services/utils/post-utils.service";
import {
    addPostFeeling,
    closeModal,
    toggleGifModal,
} from "@redux/reducers/modal/modal.reducer";
import Giphy from "@components/giphy/Giphy";
import { ImageUtils } from "@services/utils/image-utils.service";
import Spinner from "@components/spinner/Spinner";
import { find } from "lodash";
import { Utils } from "@services/utils/utils.service";

const EditPost = () => {
    const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
    const { post } = useSelector((state) => state);
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
        imgId: "",
        imgVersion: "",
        videoId: "",
        videoVersion: "",
        video: "",
    });
    const [disable, setDisable] = useState(true);
    const [apiResponse, setApiResponse] = useState("");
    const [selectedPostImage, setSelectedPostImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
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

    const postInputEditable = (event, textContent) => {
        const currentTextLength = event.target.textContent.length;
        const counter = maxNumberOfCharacters - currentTextLength;
        counterRef.current.textContent = `${counter}/100`;
        setDisable(currentTextLength <= 0 && !postImage);
        PostUtils.postInputEditable(textContent, postData, setPostData);
    };

    const closePostModal = () => {
        PostUtils.closePostModal(dispatch);
    };

    const onKeyDown = (event) => {
        const currentTextLength = event.target.textContent.length;
        if (
            currentTextLength === maxNumberOfCharacters &&
            event.keyCode !== 8
        ) {
            event.preventDefault();
        }
    };

    const onPaste = (event) => {
        const pastedText = event.clipboardData.getData("Text");
        const currentTextLength = event.target.textContent.length;
        const counter = maxNumberOfCharacters - currentTextLength;
        if (pastedText.length > counter) {
            event.preventDefault();
        }
    };

    const clearImage = () => {
        setSelectedVideo(null);
        setHasVideo(false);
        PostUtils.clearImage(
            postData,
            post?.post,
            inputRef,
            dispatch,
            setSelectedPostImage,
            setPostImage,
            setPostData
        );
    };

    const getFeeling = useCallback(
        (name) => {
            const feeling = find(feelingsList, (data) => data.name === name);
            dispatch(addPostFeeling({ feeling }));
        },
        [dispatch]
    );

    const postInputData = useCallback(() => {
        setTimeout(() => {
            if (imageInputRef?.current) {
                postData.post = post?.post;
                imageInputRef.current.textContent = post?.post;
                setPostData(postData);
            }
        });
    }, [post, postData]);

    const editableFields = useCallback(() => {
        if (post?.feelings) {
            getFeeling(post?.feelings);
        }

        if (post?.bgColor) {
            postData.bgColor = post?.bgColor;
            setPostData(postData);
            setTextAreaBackground(post?.bgColor);
            setTimeout(() => {
                if (inputRef?.current) {
                    postData.post = post?.post;
                    inputRef.current.textContent = post?.post;
                    setPostData(postData);
                }
            });
        }

        if (post?.gifUrl && !post?.imgId && post.videoId) {
            postData.gifUrl = post?.gifUrl;
            postData.videoId = "";
            postData.videoVersion = "";
            postData.imgId = "";
            postData.imgVersion = "";
            postData.video = "";
            postData.image = "";
            setPostImage(post?.gifUrl);
            setHasVideo(false);
            postInputData();
        }

        if (post?.imgId && !post?.gifUrl) {
            postData.imgId = post?.imgId;
            postData.imgVersion = post?.imgVersion;
            postData.videoId = "";
            postData.videoVersion = "";
            postData.video = "";
            const imageUrl = Utils.getImage(post?.imgId, post?.imgVersion);
            setPostImage(imageUrl);
            setHasVideo(false);
            postInputData();
        }

        if (post?.videoId && !post?.imgId && !post?.gifUrl) {
            postData.videoId = post?.videoId;
            postData.videoVersion = post?.videoVersion;
            postData.imgId = "";
            postData.imgVersion = "";
            postData.image = "";
            const videoUrl = Utils.getVideo(post?.videoId, post?.videoVersion);
            setPostImage(videoUrl);
            setHasVideo(true);
            postInputData();
        }
    }, [post, postData, getFeeling, postInputData]);

    const updatePost = async () => {
        setLoading(!loading);
        setDisable(!disable);
        try {
            if (Object.keys(feeling).length) {
                postData.feelings = feeling?.name;
            }
            if (postData.gifUrl || (postData.imgId && postData.imgVersion)) {
                postData.bgColor = "#ffffff";
            }
            postData.privacy = post?.privacy || "Public";
            postData.profilePicture = profile?.profilePicture;
            if (selectedPostImage || selectedVideo) {
                let result = "";
                if (selectedPostImage) {
                    result = await ImageUtils.readAsBase64(selectedPostImage);
                }
                if (selectedVideo) {
                    result = await ImageUtils.readAsBase64(selectedVideo);
                }
                const type = selectedPostImage ? "image" : "video";
                if (type === "image") {
                    postData.image = result;
                    postData.video = "";
                } else {
                    postData.image = "";
                    postData.video = result;
                }
                postData.gifUrl = "";
                postData.imgId = "";
                postData.imgVersion = "";
                postData.videoId = "";
                postData.videoVersion = "";
                await PostUtils.sendUpdatePostWithFileRequest(
                    type,
                    post?._id,
                    postData,
                    setApiResponse,
                    setLoading,
                    dispatch
                );
            } else {
                setHasVideo(false);
                await PostUtils.sendUpdatePostRequest(
                    post?._id,
                    postData,
                    setApiResponse,
                    setLoading,
                    dispatch
                );
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
    }, [post]);

    useEffect(() => {
        setTimeout(() => {
            if (
                imageInputRef?.current &&
                imageInputRef?.current.textContent.length
            ) {
                counterRef.current.textContent = `${
                    maxNumberOfCharacters -
                    imageInputRef?.current.textContent.length
                }/100`;
            } else if (
                inputRef?.current &&
                inputRef?.current.textContent.length
            ) {
                counterRef.current.textContent = `${
                    maxNumberOfCharacters - inputRef?.current.textContent.length
                }/100`;
            }
        });
    }, []);

    useEffect(() => {
        if (!loading && apiResponse === "success") {
            dispatch(closeModal());
        }
        setDisable(post?.post.length <= 0 && !postImage);
    }, [loading, dispatch, apiResponse, post, postImage]);

    useEffect(() => {
        if (post?.gifUrl) {
            postData.image = "";
            postData.video = "";
            setSelectedPostImage(null);
            setSelectedVideo(null);
            setHasVideo(false);
            setPostImage(post?.gifUrl);
            PostUtils.postInputData(
                imageInputRef,
                postData,
                post?.post,
                setPostData
            );
        } else if (post?.image) {
            setPostImage(post?.image);
            setHasVideo(false);
            PostUtils.postInputData(
                imageInputRef,
                postData,
                post?.post,
                setPostData
            );
        } else if (post?.video) {
            setPostImage(post?.video);
            setHasVideo(true);
            PostUtils.postInputData(
                imageInputRef,
                postData,
                post?.post,
                setPostData
            );
        }
        editableFields();
    }, [editableFields, post, postData]);

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
                                <span>Updating post...</span>
                                <Spinner />
                            </div>
                        )}

                        <div className="w-full text-2xl font-bold">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <FaArrowLeft
                                        className="cursor-pointer"
                                        onClick={closePostModal}
                                    />
                                    <span>Edit Post</span>
                                </div>

                                <div className="flex items-center gap-2"></div>
                            </div>
                        </div>

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
                                                    onInput={(e) =>
                                                        postInputEditable(
                                                            e,
                                                            e.currentTarget
                                                                .textContent
                                                        )
                                                    }
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
                                            onInput={(e) =>
                                                postInputEditable(
                                                    e,
                                                    e.currentTarget.textContent
                                                )
                                            }
                                            onKeyDown={onKeyDown}
                                            onPaste={onPaste}
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
                                                        src={`${postImage}`}
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
                                onClick={() => updatePost()}
                                className={`cursor-pointer max-w-[100vw] size-full bg-primary hover:bg-primary-dark transition-colors flex justify-center items-center rounded-[15px] px-4 py-2 text-white ${
                                    disable
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                data-testid="edit-button"
                            >
                                <Button
                                    label="Update Post"
                                    className="post-button"
                                    disabled={disable}
                                    handleClick={updatePost}
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

export default EditPost;
