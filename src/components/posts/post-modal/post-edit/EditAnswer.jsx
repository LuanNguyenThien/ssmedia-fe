import ModalBoxContent from "@components/posts/post-modal/modal-box-content/ModalBoxContent";
import PostWrapper from "@components/posts/modal-wrappers/post-wrapper/PostWrapper";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { FaTimes } from "react-icons/fa";
import { PostUtils } from "@services/utils/post-utils.service";
import { closeModal, addPostFeeling } from "@redux/reducers/modal/modal.reducer";
import { Utils } from "@services/utils/utils.service";
import Spinner from "@components/spinner/Spinner";
import Avatar from "@components/avatar/Avatar";
import ImageModal from "@components/image-modal/ImageModal";
import "@components/posts/post-modal/post-add/AddPost.scss";
import useIsMobile from "@hooks/useIsMobile";
import { find } from "lodash";
import { feelingsList } from "@services/utils/static.data";
import { postService } from "@services/api/post/post.service";

export default function EditAnswer() {
    const modalRef = useRef(null);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const [blockNoteHeight, setBlockNoteHeight] = useState('350px');

    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");

    const { feeling, data } = useSelector((state) => state.modal);
    const postData = useSelector((state) => state.post);
    const { profile } = useSelector((state) => state.user);
    const isMobile = useIsMobile();
    const [loading, setLoading] = useState(false);
    const [isTextEdited, setIsTextEdited] = useState(false);
    const [apiResponse, setApiResponse] = useState("");
    const [questionData, setQuestionData] = useState(null);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    
    const [answerData, setAnswerData] = useState({
        htmlPost: "",
        post: "",
        questionId: "",
        bgColor: "#ffffff",
        privacy: "",
        feelings: "",
        profilePicture: "",
        type: "answer"
    });
    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const editor = useCreateBlockNote({ uploadFile });

    const modalClasses = useMemo(() => {
        const base = "modal-box flex flex-col";
        
        if (isMobile) {
            return `${base} ios-modal-fix w-full h-full max-h-screen`;
        }
        
        return `${base} w-[500px] h-[80vh] mx-auto`;
    }, [isMobile]);

    // Lấy thông tin answer từ data trong modal
    const answerInfo = data || {};
    const {
        _id: answerId,
        htmlPost,
        post,
        questionId,
        feelings,
        privacy,
        userId,
    } = answerInfo;

    // Function để fetch question data
    const fetchQuestionData = async (questionId) => {
        try {
            setLoadingQuestion(true);
            const response = await postService.getPost(questionId);
            if (response.data && response.data.post) {
                setQuestionData(response.data.post);
            }
        } catch (error) {
            console.error("Error fetching question:", error);
            Utils.dispatchNotification(
                "Error loading question data",
                "error",
                dispatch
            );
        } finally {
            setLoadingQuestion(false);
        }
    };

    // Function để mở image modal
    const openImageModal = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setShowImageModal(true);
    };

    // Function để đóng image modal
    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImageUrl("");
    };

    const handleEditorDataChange = async () => {
        const blocks = await editor.blocksToHTMLLossy(editor.document);
        const doc = new DOMParser().parseFromString(blocks, "text/html");
        const images = doc.body.querySelectorAll("img");

        const containerWidth = 400;

        await Promise.all(
            Array.from(images).map(
                (img) =>
                    new Promise((resolve) => {
                        if (img.width > containerWidth) {
                            img.setAttribute("width", 1200);
                            img.removeAttribute("data-preview-width");
                        }
                        resolve();
                    })
            )
        );

        const newBlocks = doc.body.innerHTML;
        const plainText = Array.from(
            doc.body.querySelectorAll(
                "h1,h2,h3, p, div, blockquote, li, span, strong"
            )
        )
            .map((element) => element.textContent.trim())
            .join(" ");

        PostUtils.postInputEditable(plainText, answerData, setAnswerData);
        PostUtils.postInputHtml(newBlocks, answerData, setAnswerData);
        setDisable(newBlocks.trim().length === 0);
        setIsTextEdited(true);
    };

    const closeAnswerModal = () => {
        dispatch(closeModal());
    };

    const getFeeling = useCallback(
        (name) => {
            const feeling = find(feelingsList, (data) => data.name === name);
            dispatch(addPostFeeling({ feeling }));
        },
        [dispatch]
    );

    const loadEditor = async (text) => {
        const blocks = await editor.tryParseHTMLToBlocks(text || "");
        editor.replaceBlocks(editor.document, blocks);
    };

    useEffect(() => {
        const calculateHeight = () => {
            if (modalRef.current && headerRef.current && footerRef.current) {
                const modalHeight = modalRef.current.offsetHeight;
                const headerHeight = headerRef.current.offsetHeight;
                const footerHeight = footerRef.current.offsetHeight;
                const padding = 35;
                
                const availableHeight = modalHeight - headerHeight - footerHeight - padding;
                const finalHeight = Math.max(availableHeight, 200);
                
                setBlockNoteHeight(`${finalHeight}px`);
            }
        };

        const timer = setTimeout(calculateHeight, 100);
        
        window.addEventListener('resize', calculateHeight);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateHeight);
        };
    }, []);

    useEffect(() => {
        const trimmed = answerData.htmlPost.trim();
        setDisable(
            trimmed.length <= 0 ||
                trimmed === "<br>" ||
                trimmed === "<br/>" ||
                trimmed === "<br></br>" ||
                trimmed === "<p></p><p></p>" ||
                trimmed === "<p></p>" ||
                trimmed === '<p class="none"></p>' ||
                trimmed === '<p></p><p class="none"></p>' ||
                trimmed === '<p class="none"></p><p class="none"></p>'
        );
    }, [answerData]);

    // Load dữ liệu ban đầu
    useEffect(() => {
        if (htmlPost) {
            loadEditor(htmlPost);
        }
        
        // Set initial data từ answer info
        setAnswerData({
            htmlPost: htmlPost || "",
            post: post || "",
            questionId: questionId || "",
            bgColor: "#ffffff",
            privacy: privacy || "Public",
            feelings: feelings || "",
            profilePicture: profile?.profilePicture || "",
            type: "answer"
        });

        // Set feeling if exists
        if (feelings) {
            getFeeling(feelings);
        }

        // Fetch question data nếu có questionId
        if (questionId) {
            fetchQuestionData(questionId);
        }
    }, [htmlPost, post, questionId, privacy, feelings, profile?.profilePicture, getFeeling]);

    useEffect(() => {
        if (!loading && apiResponse === "success") {
            dispatch(closeModal());
        }
    }, [loading, dispatch, apiResponse]);

    const updateAnswer = async () => {
        setLoading(true);
        setDisable(true);
        try {
            if (Object.keys(feeling).length) {
                answerData.feelings = feeling?.name;
            }
            answerData.privacy = postData.privacy || "Public";
            answerData.profilePicture = profile?.profilePicture;
            answerData.type = "answer";

            // Xóa <br>, <br/>, <br></br> ở cuối answer và thêm class="none"
            if (typeof answerData.htmlPost === "string") {
                answerData.htmlPost = answerData.htmlPost
                    .replace(/(<br\s*\/?>|<br><\/br>)+$/gi, "")
                    .replace(/(<p>\s*<\/p>)+$/gi, '<p class="none"></p>');
            }

            await PostUtils.sendUpdatePostRequest(
                answerId,
                answerData,
                setApiResponse,
                setLoading,
                dispatch
            );
        } catch (error) {
            console.error("Error updating answer:", error);
            PostUtils.dispatchNotification(
                error.response?.data?.message || "Error updating answer",
                "error",
                setApiResponse,
                setLoading,
                dispatch
            );
        }
    };

    async function uploadFile(file) {
        const MAX_FILE_SIZE = 35 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert("File size exceeds the limit of 35MB.");
            throw new Error("File size exceeds 35MB limit");
        }
        const body = new FormData();
        body.append("file", file);
        const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
            method: "POST",
            body: body,
        });
        return (await ret.json()).data.url.replace(
            "tmpfiles.org/",
            "tmpfiles.org/dl/"
        );
    }

    // Render question preview
    const renderQuestionPreview = () => {
        if (loadingQuestion) {
            return (
                <div className={`${isMobile ? "pb-6" : "pb-8"}`}>
                    <div className="animate-pulse">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (!questionData) {
            return (
                <div className={`${isMobile ? "pb-6" : "pb-8"}`}>
                    <div className="text-center py-4">
                        <p className="text-gray-500">Unable to load question data</p>
                    </div>
                </div>
            );
        }

        return (
            <div className={`${isMobile ? "pb-6" : "pb-8"}`}>
                <div className="space-y-4">
                    <div
                        className={`flex items-start ${
                            isMobile ? "gap-2" : "gap-3"
                        }`}
                    >
                        <div
                            className={`${
                                isMobile ? "w-6 h-6" : "w-8 h-8"
                            } bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                        >
                            <span
                                className={`text-green-600 font-medium ${
                                    isMobile ? "text-xs" : "text-sm"
                                }`}
                            >
                                Q
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p
                                className={`text-gray-500 ${
                                    isMobile ? "text-xs" : "text-sm"
                                } mb-2 font-medium`}
                            >
                                {questionData.username} asked
                            </p>
                            <h1
                                className={`${
                                    isMobile
                                        ? "text-base leading-5 mb-3"
                                        : "text-xl leading-7 mb-4"
                                } font-medium text-gray-900`}
                            >
                                {questionData.post}
                            </h1>
                        </div>
                    </div>

                    {/* Question Media - only show if exists */}
                    {(questionData.gifUrl ||
                        (questionData.imgId && questionData.imgVersion) ||
                        (questionData.videoId && questionData.videoVersion)) && (
                        <div className={`${isMobile ? "ml-8" : "ml-11"}`}>
                            {/* GIF */}
                            {questionData.gifUrl && (
                                <div className="rounded-lg overflow-hidden bg-gray-50 mb-4">
                                    <img
                                        src={questionData.gifUrl}
                                        alt="Question attachment"
                                        className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => openImageModal(questionData.gifUrl)}
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Image */}
                            {questionData.imgId && questionData.imgVersion && (
                                <div className="rounded-lg overflow-hidden bg-gray-50 mb-4">
                                    <img
                                        src={Utils.appImageUrl(
                                            questionData.imgVersion,
                                            questionData.imgId
                                        )}
                                        alt="Question attachment"
                                        className={`w-full h-auto ${
                                            isMobile ? "max-h-48" : "max-h-96"
                                        } object-contain cursor-pointer hover:opacity-90 transition-opacity`}
                                        onClick={() =>
                                            openImageModal(
                                                Utils.appImageUrl(
                                                    questionData.imgVersion,
                                                    questionData.imgId
                                                )
                                            )
                                        }
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Video */}
                            {questionData.videoId && questionData.videoVersion && (
                                <div className="rounded-lg overflow-hidden bg-gray-50 mb-4">
                                    <video
                                        controls
                                        className={`w-full ${
                                            isMobile ? "max-h-48" : "max-h-96"
                                        }`}
                                        src={Utils.appImageUrl(
                                            questionData.videoVersion,
                                            questionData.videoId
                                        )}
                                        preload="metadata"
                                    >
                                        Your browser does not support the video
                                        tag.
                                    </video>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {showImageModal && (
                <ImageModal
                    image={selectedImageUrl}
                    onCancel={closeImageModal}
                    showArrow={false}
                />
            )}

            <PostWrapper>
                <div></div>
                <div
                    ref={modalRef}
                    className={modalClasses}
                >
                    {loading && (
                        <div
                            className="modal-box-loading"
                            data-testid="modal-box-loading"
                        >
                            <span>Updating your answer...</span>
                            <Spinner />
                        </div>
                    )}

                    {/* Header */}
                    <div
                        ref={headerRef}
                        className={`flex items-center justify-between ${
                            isMobile ? "px-4 py-3" : "px-8 py-6"
                        } border-b border-gray-100`}
                    >
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={isMobile ? 40 : 48}
                                bgColor={profile?.avatarColor}
                                textColor="#ffffff"
                                profilePicture={profile?.profilePicture}
                                username={profile?.username}
                                avatarSrc={profile?.profilePicture}
                            />
                            <div>
                                <div
                                    className={`font-semibold text-gray-900 ${
                                        isMobile ? "text-base" : "text-lg"
                                    }`}
                                >
                                    {profile?.username}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Editing answer
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={closeAnswerModal}
                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <FaTimes
                                className={`${
                                    isMobile ? "w-4 h-4" : "w-5 h-5"
                                } text-gray-400`}
                            />
                        </button>
                    </div>

                    {/* Content */}
                    <div
                        className={`flex-1 overflow-y-auto ${
                            isMobile ? "overflow-x-hidden" : ""
                        }`}
                        style={
                            isMobile ? { WebkitOverflowScrolling: "touch" } : {}
                        }
                    >
                        <div
                            className={`${
                                isMobile ? "px-4 py-4" : "px-4 py-4"
                            }`}
                        >
                            {/* Question Preview */}
                            {renderQuestionPreview()}

                            {/* Answer Section */}
                            <div
                                className={`${
                                    isMobile ? "space-y-4" : "space-y-6"
                                }`}
                            >
                                {/* Your Answer Label */}
                                <div
                                    className={`flex items-center gap-3 ${
                                        isMobile ? "pt-4" : "pt-6"
                                    } border-t border-gray-100`}
                                >
                                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-medium text-sm">
                                            A
                                        </span>
                                    </div>
                                    <h2
                                        className={`${
                                            isMobile ? "text-base" : "text-lg"
                                        } font-semibold text-gray-900`}
                                    >
                                        Your answer
                                    </h2>
                                </div>

                                {/* Modal Box Content */}
                                <div
                                    className={`${isMobile ? "" : ""}`}
                                >
                                    <ModalBoxContent />
                                </div>

                                {/* Editor Container */}
                                <div
                                    className={`${isMobile ? "" : ""}`}
                                >
                                    <div
                                        style={{ height: blockNoteHeight }}
                                        className={`border border-gray-200 rounded-xl overflow-auto ${
                                            isMobile
                                                ? "p-0"
                                                : "p-1"
                                        } focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all`}
                                    >
                                        <BlockNoteView
                                            editor={editor}
                                            onChange={handleEditorDataChange}
                                            theme="light"
                                            placeholder="Edit your answer here..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        ref={footerRef}
                        className={`${
                            isMobile ? "px-4 py-4" : "px-8 py-6"
                        } border-t border-gray-100 bg-gray-50/50`}
                    >
                        <div
                            className={`flex ${
                                isMobile
                                    ? "flex-col gap-3"
                                    : "justify-between items-center"
                            }`}
                        >
                            <div
                                className={`text-sm text-gray-500 ${
                                    isMobile ? "text-center" : ""
                                }`}
                            >
                                Update your answer to help others
                            </div>
                            <div
                                className={`flex gap-3 ${
                                    isMobile ? "justify-center" : ""
                                }`}
                            >
                                <button
                                    onClick={closeAnswerModal}
                                    className={`${
                                        isMobile ? "px-4 py-2" : "px-5 py-2.5"
                                    } text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateAnswer}
                                    disabled={disable}
                                    className={`${
                                        isMobile ? "px-4 py-2" : "px-6 py-2.5"
                                    } rounded-lg font-semibold transition-all ${
                                        disable
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                                    }`}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </PostWrapper>
        </>
    );
}