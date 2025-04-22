import Input from "@components/input/Input";
import Button from "@components/button/Button";
import { FaPaperPlane } from "react-icons/fa";
import { icons } from "@assets/assets";
import { Image, SmilePlus, Send } from "lucide-react";
import PropTypes from "prop-types";
import "@components/posts/comments/comment-input/CommentInputBox.scss";
import "@components/chat/window/message-input/MessageInput.scss";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { Utils } from "@services/utils/utils.service";
import { cloneDeep } from "lodash";
import { socketService } from "@services/socket/socket.service";
import { postService } from "@services/api/post/post.service";
import ImagePreview from "@components/chat/image-preview/ImagePreview";
import { ImageUtils } from "@services/utils/image-utils.service";
import loadable from "@loadable/component";

const EmojiPickerComponent = loadable(
  () => import("@components/chat/window/message-input/EmojiPicker"),
  {
    fallback: <p id="loading">Loading...</p>,
  }
);

const CommentInputBox = ({ post, parentId = null, onCommentAdded }) => {
  const { profile } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [showEmojiContainer, setShowEmojiContainer] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [file, setFile] = useState();
  const [base64File, setBase64File] = useState("");
  const [hasFocus, setHasFocus] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const fileInputRef = useRef();
  const commentInputRef = useRef(null);
  const dispatch = useDispatch();

  const addToPreview = async (file) => {
    let type;
    if (file.type.startsWith("image/")) {
      type = "image";
    } else if (file.type.startsWith("video/")) {
      type = "video";
    } else {
      window.alert(`File ${file.name} is not a valid image or video.`);
      return;
    }
    ImageUtils.checkFile(file, type);
    setFile(URL.createObjectURL(file));
    const result = await ImageUtils.readAsBase64(file);
    setBase64File(result);
    setShowImagePreview(true);
    setShowEmojiContainer(false);
  };

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const reset = () => {
    setBase64File("");
    setShowImagePreview(false);
    setShowEmojiContainer(false);
    setFile("");
  };

  const submitComment = async (event) => {
    event.preventDefault();
    try {
      const updatedPost = cloneDeep(post);
      updatedPost.commentsCount += 1;
      const commentBody = {
        userTo: updatedPost?.userId,
        postId: updatedPost?._id,
        comment: comment.trim(),
        selectedImage: base64File || "",
        commentsCount: updatedPost.commentsCount,
        profilePicture: profile?.profilePicture,
        parentId,
      };
      socketService?.socket?.emit("comment", commentBody);
      await postService.addComment(commentBody);
      reset();
      setComment("");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      Utils.dispatchNotification(
        error.response?.data?.message || "Đã xảy ra lỗi",
        "error",
        dispatch
      );
    }
  };

  useEffect(() => {
    if (commentInputRef?.current) {
      commentInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="w-full max-w-full mx-auto mt-2">
        <div className="relative flex items-center gap-2 p-1 bg-slate-50 rounded-2xl">
          <div className="flex-1">
            {showImagePreview && (
              <div className="absolute top-14 left-0 w-full z-10">
                <ImagePreview
                  image={file}
                  onClick={() => setIsZoomed(true)}
                  onRemoveImage={() => {
                    setFile("");
                    setBase64File("");
                    setShowImagePreview(false);
                  }}
                />
              </div>
            )}
            <input
              type="text"
              placeholder="Write your message..."
              className="w-full bg-transparent pl-4 outline-none text-gray-600 placeholder:text-gray-500"
              ref={commentInputRef}
              name="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
            />
          </div>
          <div className="flex items-center gap-2 pr-2">
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = null;
                }
              }}
              handleChange={(event) => addToPreview(event.target.files[0])}
            />

            <button
              type="button"
              onClick={() => {
                fileInputClicked();
                setShowEmojiContainer(false);
              }}
              className="flex items-center justify-center text-blue-600 h-8 w-8 rounded-full hover:bg-slate-200"
            >
              <Image className="h-5 w-5" />
              <span className="sr-only">Upload image</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center text-amber-500 h-8 w-8 rounded-full hover:bg-slate-200"
              onClick={() => {
                setShowEmojiContainer(!showEmojiContainer);
                setShowImagePreview(false);
              }}
            >
              <SmilePlus className="h-5 w-5" />
              <span className="sr-only">Add emoji</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white h-10 w-10 rounded-full disabled:bg-blue-300 disabled:cursor-not-allowed"
              onClick={submitComment}
              disabled={!comment && !showImagePreview}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </div>
      </div>

      {showEmojiContainer && (
        <EmojiPickerComponent
          onEmojiClick={(emojiData, event) => {
            setComment((prev) => prev + emojiData.emoji);
          }}
          pickerStyle={{ width: "352px", height: "447px" }}
        />
      )}

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={file}
            alt="zoomed"
            className="max-w-full max-h-full rounded-lg shadow-lg transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

CommentInputBox.propTypes = {
  post: PropTypes.object,
  parentId: PropTypes.string,
  onCommentAdded: PropTypes.func,
};

export default CommentInputBox;
