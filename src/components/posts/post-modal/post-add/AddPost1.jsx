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
import { closeModal } from "@redux/reducers/modal/modal.reducer";
import { postService } from "@services/api/post/post.service";
import Spinner from "@components/spinner/Spinner";

export default function AddPost() {
  const { feeling } = useSelector((state) => state.modal);
  const { privacy } = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
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
    const plainText = Array.from(doc.body.querySelectorAll("h1, p, div"))
      .map((element) => element.textContent.trim())
      .join(" ");
    PostUtils.postInputEditable(plainText, postData, setPostData);
    PostUtils.postInputHtml(blocks, postData, setPostData);
    setDisable(blocks.trim().length === 0);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  useEffect(() => {
    setDisable(postData.post.length <= 0);
  }, [postData]);

  const createPost = async () => {
    setLoading(true);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling?.name;
      }
      postData.privacy = privacy || "Public";
      postData.profilePicture = profile?.profilePicture;
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
return (
  <div className="font-sans">
    {loading && (
      <div className="modal-box-loading" data-testid="modal-box-loading">
        <span>Posting...</span>
        <Spinner />
      </div>
    )}
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full sm:w-4/5 md:w-1/3 flex flex-col h-[75vh] sm:h-[90vh]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Create Post</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closePostModal}
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-grow overflow-auto">
          <ModalBoxContent />
          <BlockNoteView editor={editor} onChange={handleEditorDataChange} />
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
            Post
          </button>
        </div>
      </div>
    </div>
  </div>
);
}