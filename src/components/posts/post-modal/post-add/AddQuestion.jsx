import ModalBoxContent from "@components/posts/post-modal/modal-box-content/ModalBoxContent";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { bgColors } from "@services/utils/static.data";
import ModalBoxSelection from "@components/posts/post-modal/modal-box-content/ModalBoxSelection";
import Button from "@components/button/Button";
import { PostUtils } from "@services/utils/post-utils.service";
import { closeModal, setModalType } from "@redux/reducers/modal/modal.reducer";
import { postService } from "@services/api/post/post.service";
import Spinner from "@components/spinner/Spinner";
import AddPost from "@components/posts/post-modal/post-add/AddPost";

export default function AddQuestion() {
  const { feeling } = useSelector((state) => state.modal);
  const { privacy } = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState("createquestion");
  const [postData, setPostData] = useState({
    htmlPost: "",
    post: "",
    bgColor: "#ffffff",
    privacy: "",
    feelings: "",
    profilePicture: "",
  });
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch();
  const editor = useCreateBlockNote({ uploadFile });

  const handleEditorDataChange = async () => {
    const blocks = await editor.blocksToHTMLLossy(editor.document);
    const doc = new DOMParser().parseFromString(blocks, "text/html");
    const images = doc.body.querySelectorAll("img");
  
    // Giả sử vùng chứa là 400px (hoặc lấy ref thực tế nếu có)
    const containerWidth = 400;
  
    // Duyệt từng ảnh, kiểm tra naturalWidth
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
    const plainText = Array.from(doc.body.querySelectorAll("h1, p, div"))
      .map((element) => element.textContent.trim())
      .join(" ");
    PostUtils.postInputEditable(plainText, postData, setPostData);
    PostUtils.postInputHtml(newBlocks, postData, setPostData);
    setDisable(newBlocks.trim().length === 0);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  useEffect(() => {
    const trimmed = postData.htmlPost.trim();
    // Disable nếu rỗng hoặc chỉ chứa <br> (có thể là <br> hoặc <br></br>)
    setDisable(
      trimmed.length <= 0 ||
      trimmed === "<br>" ||
      trimmed === "<br/>" ||
      trimmed === "<br></br>" ||
      trimmed === "<p></p><p></p>" ||
      trimmed === "<p></p>" ||
      trimmed === "<p class=\"none\"></p>" ||
      trimmed === "<p></p><p class=\"none\"></p>" ||
      trimmed === "<p class=\"none\"></p><p class=\"none\"></p>"
    );
  }, [postData]);

  const createPost = async () => {
    setLoading(true);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling?.name;
      }
      postData.privacy = privacy || "Public";
      postData.profilePicture = profile?.profilePicture;
      // Xóa <br>, <br/>, <br></br> ở cuối post
      if (typeof postData.htmlPost === "string") {
        // Thêm class="none" vào <p></p> rỗng ở cuối
        postData.htmlPost = postData.htmlPost
          .replace(/(<br\s*\/?>|<br><\/br>)+$/gi, "")
          .replace(/(<p>\s*<\/p>)+$/gi, '<p class="none"></p>');
      }
      const response = await postService.createPost(postData);
      if (response) {
        setLoading(false);
        closePostModal();
      }
    } catch (error) {
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
  const handlePostTypeChange = (e) => {
    const value = e.target.value;
    setPostType(value);

    if (value === "createpost") {
      // console.log();
      dispatch(setModalType("createpost")); // mở modal loại khác, ví dụ sẽ render AddQuestion
      // closePostModal();
    }
  };
  return (
    <>
      <div className="font-sans">
        {loading && (
          <div className="modal-box-loading" data-testid="modal-box-loading">
            <span>Posting...</span>
            <Spinner />
          </div>
        )}
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full sm:w-4/5 md:w-1/2 flex flex-col h-[75vh] sm:h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="relative w-fit">
                <select
                  className="appearance-none text-lg font-semibold bg-white text-gray-800 rounded-full px-4 py-2 pr-10 transition duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={postType}
                  onChange={handlePostTypeChange}
                >
                  <option value="createpost">📝 Create Post</option>
                  <option value="createquestion">❓ Create Question</option>
                </select>
                <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
                  ▼
                </div>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closePostModal}
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-grow overflow-auto">
              <ModalBoxContent />
              <BlockNoteView
                editor={editor}
                onChange={handleEditorDataChange}
                // data-color-scheme="light"
                // data-mantine-color-scheme="light"
                theme="light"
              />
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                className={`w-full py-3 rounded-full transition duration-200 text-white ${
                  disable
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={disable}
                onClick={createPost}
              >
                Create Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
