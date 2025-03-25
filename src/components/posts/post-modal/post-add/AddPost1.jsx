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
import {
  closeModal,
  toggleGifModal,
} from "@redux/reducers/modal/modal.reducer";
import Giphy from "@components/giphy/Giphy";
import PropTypes from "prop-types";
import { ImageUtils } from "@services/utils/image-utils.service";
import { postService } from "@services/api/post/post.service";
import Spinner from "@components/spinner/Spinner";
export default function AddPost() {
  const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
  const { gifUrl, image, privacy, video } = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [postImage, setPostImage] = useState("");
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
  const editor = useCreateBlockNote({
   
    uploadFile,
  });
  let blocks = "";
  const maxNumberOfCharacters = 1000;

  const handleEditorDataChange = async () => {
    blocks = await editor.blocksToHTMLLossy(editor.document);
    console.log(blocks);
    const doc = new DOMParser().parseFromString(blocks, "text/html");

    const elements = doc.body.querySelectorAll("h1, p, div"); 


    const plainText = Array.from(elements)
      .map((element) => element.textContent.trim()) 
      .join(" "); 

    console.log("plain", plainText);
    PostUtils.postInputEditable(plainText, postData, setPostData);
    PostUtils.postInputHtml(blocks, postData, setPostData);
    setDisable(blocks.trim().length === 0);
    console.log(disable);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  useEffect(() => {
    if (!loading && apiResponse === "success") {
      dispatch(closeModal());
    }
    setDisable(postData.post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, postData, postImage]);

  const createPost = async () => {
    setLoading(!loading);
    setDisable(!disable);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling?.name;
      }
      postData.privacy = privacy || "Public";
      postData.profilePicture = profile?.profilePicture;
      const response = await postService.createPost(postData);
      console.log("response", response);
      if (response) {
        setApiResponse("success");
        setLoading(false);
        setHasVideo(false);
        PostUtils.closePostModal(dispatch);
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
        <div className="bg-white rounded-lg shadow-xl h-5/6 w-1/3 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">Create Post</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => closePostModal()}
            >
              X
            </button>
          </div>

          <div className="flex-grow overflow-auto">
            <div className="mb-6">
              <ModalBoxContent />
            </div>
            <BlockNoteView
              editor={editor}
              onChange={() => {
                handleEditorDataChange();
              }}
            />
          </div>

          <div className="p-4 border-b border-gray-200 mb-4"></div>
          <button
            className={`w-10/12 py-3 rounded-full transition duration-200 mb-3 mx-auto ${
              disable
                ? "bg-blue-300 cursor-not-allowed text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={disable}
            onClick={createPost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
