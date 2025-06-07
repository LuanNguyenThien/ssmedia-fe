import ModalBoxContent from "@components/posts/post-modal/modal-box-content/ModalBoxContent";
import PostWrapper from "@components/posts/modal-wrappers/post-wrapper/PostWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { FaTimes } from "react-icons/fa";
import { PostUtils } from "@services/utils/post-utils.service";
import { closeModal } from "@redux/reducers/modal/modal.reducer";
import { answerService } from "@services/api/answer/answer.service";
import { Utils } from "@services/utils/utils.service";
import Spinner from "@components/spinner/Spinner";
import Avatar from "@components/avatar/Avatar";
import ImageModal from "@components/image-modal/ImageModal";
import "@components/posts/post-modal/post-add/AddPost.scss";
import useIsMobile from "@hooks/useIsMobile";

export default function AddAnswer({ questionId }) {
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");

    const { feeling, data } = useSelector((state) => state.modal);
    const { privacy } = useSelector((state) => state.post);
    const { profile } = useSelector((state) => state.user);
    const isMobile = useIsMobile();
    const [loading, setLoading] = useState(false);
    const [answerData, setAnswerData] = useState({
        htmlPost: "",
        post: "",
        questionId: questionId || data?.questionId,
        bgColor: "#ffffff",
        privacy: "",
        feelings: "",
        profilePicture: "",
    });
    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const editor = useCreateBlockNote({ uploadFile });

    // Lấy thông tin question từ data trong modal
    const questionData = data || {};
    const {
        question,
        username,
        gifUrl,
        imgId,
        imgVersion,
        videoId,
        videoVersion,
    } = questionData;

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
    };

    const closeAnswerModal = () => {
        dispatch(closeModal());
    };

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

    const createAnswer = async () => {
        setLoading(true);
        try {
            if (Object.keys(feeling).length) {
                answerData.feelings = feeling?.name;
            }
            answerData.privacy = privacy || "Public";
            answerData.profilePicture = profile?.profilePicture;
            answerData.questionId = questionId || data?.questionId;

            // Xóa <br>, <br/>, <br></br> ở cuối answer
            if (typeof answerData.htmlPost === "string") {
                answerData.htmlPost = answerData.htmlPost
                    .replace(/(<br\s*\/?>|<br><\/br>)+$/gi, "")
                    .replace(/(<p>\s*<\/p>)+$/gi, '<p class="none"></p>');
            }

            const response = await answerService.createAnswer(answerData);
            if (response) {
                setLoading(false);
                closeAnswerModal();
                // Chuyển hướng đến trang question detail
                navigate(
                    `/app/social/question/${questionId || data?.questionId}`
                );
            }
        } catch (error) {
            console.error("Error creating answer:", error);
            setLoading(false);
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
        return (
            <div className={`${isMobile ? "pb-6" : "pb-8"}`}>
                {/* Question */}
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
                                {username} asked
                            </p>
                            <h1
                                className={`${
                                    isMobile
                                        ? "text-base leading-5 mb-3"
                                        : "text-xl leading-7 mb-4"
                                } font-medium text-gray-900`}
                            >
                                {question}
                            </h1>
                        </div>
                    </div>

                    {/* Question Media - only show if exists */}
                    {(gifUrl ||
                        (imgId && imgVersion) ||
                        (videoId && videoVersion)) && (
                        <div className={`${isMobile ? "ml-8" : "ml-11"}`}>
                            {/* GIF */}
                            {gifUrl && (
                                <div className="rounded-lg overflow-hidden bg-gray-50 mb-4">
                                    <img
                                        src={gifUrl}
                                        alt="Question attachment"
                                        className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => openImageModal(gifUrl)}
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Image */}
                            {imgId && imgVersion && (
                                <div className="rounded-lg overflow-hidden bg-gray-50 mb-4">
                                    <img
                                        src={Utils.appImageUrl(
                                            imgVersion,
                                            imgId
                                        )}
                                        alt="Question attachment"
                                        className={`w-full h-auto ${
                                            isMobile ? "max-h-48" : "max-h-96"
                                        } object-contain cursor-pointer hover:opacity-90 transition-opacity`}
                                        onClick={() =>
                                            openImageModal(
                                                Utils.appImageUrl(
                                                    imgVersion,
                                                    imgId
                                                )
                                            )
                                        }
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Video */}
                            {videoId && videoVersion && (
                                <div className="rounded-lg overflow-hidden bg-gray-50 mb-4">
                                    <video
                                        controls
                                        className={`w-full ${
                                            isMobile ? "max-h-48" : "max-h-96"
                                        }`}
                                        src={Utils.appImageUrl(
                                            videoVersion,
                                            videoId
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
                    className={`modal-box ${
                        isMobile
                            ? "ios-modal-fix"
                            : "!w-screen !h-[90vh] sm:!h-[80vh] sm:!max-w-1/2"
                    }`}
                >
                    {loading && (
                        <div
                            className="modal-box-loading"
                            data-testid="modal-box-loading"
                        >
                            <span>Publishing your answer...</span>
                            <Spinner />
                        </div>
                    )}

                    {/* Header */}
                    <div
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
                                    Writing an answer
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
                                isMobile ? "px-4 py-4" : "px-8 py-6"
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
                                    className={`${isMobile ? "" : "sm:ml-11"}`}
                                >
                                    <ModalBoxContent />
                                </div>

                                {/* Editor Container */}
                                <div
                                    className={`${isMobile ? "" : "sm:ml-11"}`}
                                >
                                    <div
                                        className={`border border-gray-200 rounded-xl overflow-hidden ${
                                            isMobile
                                                ? "min-h-[200px] max-h-[300px] p-1"
                                                : "min-h-[350px] p-2"
                                        } focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all`}
                                    >
                                        <BlockNoteView
                                            editor={editor}
                                            onChange={handleEditorDataChange}
                                            theme="light"
                                            placeholder="Write your answer here. Share your knowledge and help others learn..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
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
                                Be helpful and kind in your answer
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
                                    onClick={createAnswer}
                                    disabled={disable}
                                    className={`${
                                        isMobile ? "px-4 py-2" : "px-6 py-2.5"
                                    } rounded-lg font-semibold transition-all ${
                                        disable
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                                    }`}
                                >
                                    Publish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </PostWrapper>
        </>
    );
}
