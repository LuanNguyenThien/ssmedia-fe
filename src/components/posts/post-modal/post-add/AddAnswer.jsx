import ModalBoxContent from "@components/posts/post-modal/modal-box-content/ModalBoxContent";
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

export default function AddAnswer({ questionId }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const [modalHeight, setModalHeight] = useState('85vh');
  const { feeling, data } = useSelector((state) => state.modal);
  const { privacy } = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);
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
    videoVersion
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
    const plainText = Array.from(doc.body.querySelectorAll("h1,h2,h3, p, div, blockquote, li, span, strong"))
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
        navigate(`/app/social/question/${questionId || data?.questionId}`);
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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Q</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">Question by {username}</h4>
            <p className="text-xs text-gray-500">Answer this question</p>
          </div>
        </div>

        {/* Question Text */}
        {question && (
          <div className="mb-3">
            <p className="text-gray-700 text-sm leading-relaxed">{question}</p>
          </div>
        )}

        {/* Question Media */}
        <div className="space-y-3">
          {/* GIF */}
          {gifUrl && (
            <div className="rounded-lg overflow-auto">
              <img 
                src={gifUrl} 
                alt="Question GIF"
                className="w-auto h-auto rounded-lg cursor-pointer"
                onClick={() => openImageModal(gifUrl)}
                title="Click to zoom"
              />
            </div>
          )}

          {/* Image */}
          {imgId && imgVersion && (
            <div className="rounded-lg overflow-scroll">
              <img 
                src={Utils.appImageUrl(imgVersion, imgId)}
                alt="Question Image"
                className="w-auto h-auto max-h-96 max-w-full rounded-lg cursor-pointer"
                onClick={() => openImageModal(Utils.appImageUrl(imgVersion, imgId))}
                title="Click to zoom"
                loading="lazy"
              />
            </div>
          )}

          {/* Video */}
          {videoId && videoVersion && (
            <div className="rounded-lg overflow-auto">
              <video 
                controls
                className="w-full max-h-48"
                src={Utils.appImageUrl(videoVersion, videoId)}
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const updateHeight = () => {
        setModalHeight(window.innerWidth >= 640 ? '90vh' : '85vh');
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

    return (
  <>
    {showImageModal && (
        <ImageModal
            image={selectedImageUrl}
            onCancel={closeImageModal}
            showArrow={false}
        />
    )}
    <div className="font-sans">
      {loading && (
        <div className="modal-box-loading" data-testid="modal-box-loading">
          <span>Creating Answer...</span>
          <Spinner />
        </div>
      )}
      {/* Background overlay với độ mờ nhẹ hơn */}
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-2/3 lg:w-1/2 flex flex-col h-[85vh] sm:h-[90vh] max-h-screen">
          {/* Header - 64px cố định */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0" style={{ height: '64px' }}>
            <h2 className="text-lg font-semibold text-gray-800">
              💬 Create Answer
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={closeAnswerModal}
            >
              <FaTimes />
            </button>
          </div>

          {/* Content area - scroll toàn bộ */}
          <div className="flex-grow overflow-y-auto" style={{ height: 'calc(100% - 144px)' }}>
            <div className="min-h-full flex flex-col">
              {/* Question section - tự động điều chỉnh */}
              <div className="flex-shrink-0">
                <div className="p-4">
                  {renderQuestionPreview()}
                </div>
              </div>

              {/* Answer section - height = (Modal height - Header - Footer) */}
              <div 
                className="flex flex-col border-t border-gray-200"
                style={{ 
                    height: `calc(${modalHeight} - 144px)`, // Modal height - Header height - Footer height
                    minHeight: '400px'
                }}
              >
                {/* Answer header - height cố định khoảng 120px */}
                <div className="flex-shrink-0 p-4 pb-2" style={{ minHeight: '120px' }}>
                  <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">A</span>
                    </span>
                    Your Answer
                  </h3>
                  <div className="mb-4">
                    <ModalBoxContent />
                  </div>
                </div>

                {/* BlockNoteView - chiếm phần còn lại của Answer */}
                <div 
                  className="px-4 pb-4"
                  style={{ height: 'calc(100% - 120px)' }}
                >
                  <div className="border border-gray-200 rounded-lg h-full overflow-hidden">
                    <div className="h-full overflow-auto">
                      <BlockNoteView
                        editor={editor}
                        onChange={handleEditorDataChange}
                        theme="light"
                        placeholder="Write your answer here..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - 80px cố định */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-gray-50" style={{ height: '80px' }}>
            <button
              className={`w-full py-3 rounded-full transition duration-200 text-white font-medium ${
                disable
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg"
              }`}
              disabled={disable}
              onClick={createAnswer}
            >
              Post Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
}