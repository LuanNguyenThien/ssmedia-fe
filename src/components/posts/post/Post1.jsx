import Avatar from "@components/avatar/Avatar";
import { timeAgo } from "@services/utils/timeago.utils";
import PropTypes from "prop-types";
import { FaEllipsisV, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { find } from "lodash";
import { feelingsList, privacyList } from "@services/utils/static.data";
import "@components/posts/post/Post.scss";
import PostCommentSection from "@components/posts/post-comment-section/PostCommentSection";
import { useDispatch, useSelector } from "react-redux";
import ReactionsModal from "@components/posts/reactions/reactions-modal/ReactionsModal";
import { Utils } from "@services/utils/utils.service";
import useLocalStorage from "@hooks/useLocalStorage";
import CommentInputBox from "@components/posts/comments/comment-input/CommentInputBox";
import CommentsModal from "@components/posts/comments/comments-modal/CommentsModal";
import { useState, useEffect, useCallback } from "react";
import ImageModal from "@components/image-modal/ImageModal";
import { useRef } from "react";
import {
  openModal,
  toggleDeleteDialog,
} from "@redux/reducers/modal/modal.reducer";
import { clearPost, updatePostItem } from "@redux/reducers/post/post.reducer";
import Dialog from "@components/dialog/Dialog";
import { postService } from "@services/api/post/post.service";
import { ImageUtils } from "@services/utils/image-utils.service";
import { Link } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom"; // Import plugin Zoom

const Post = ({ post, showIcons }) => {
  const { profile } = useSelector((state) => state.user);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState("");
  const viewContainerRef = useRef(null); 
  const { _id } = useSelector((state) => state.post);
  const { reactionsModalIsOpen, commentsModalIsOpen, deleteDialogIsOpen } =
    useSelector((state) => state.modal);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [backgroundImageColor, setBackgroundImageColor] = useState("");
  const selectedPostId = useLocalStorage("selectedPostId", "get");
  const selectedPostCommentId = useLocalStorage("selectedPostCommentId", "get");
  const selectedPostReactId = useLocalStorage("selectedPostReactId", "get");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const editor = useCreateBlockNote();
  const [showOptions, setShowOptions] = useState(false);
  const getFeeling = (name) => {
    const feeling = find(feelingsList, (data) => data.name === name);
    return feeling?.image;
  };

  const getPrivacy = (type) => {
    const privacy = find(privacyList, (data) => data.topText === type);
    return privacy?.icon();
  };

  const deletePost = async () => {
    try {
      const response = await postService.deletePost(_id);
      if (response) {
        Utils.dispatchNotification(response.data.message, "success", dispatch);
        dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
        dispatch(clearPost());
      }
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const openPostModal = () => {
    dispatch(openModal({ type: "edit" }));
    dispatch(updatePostItem(post));
  };

  const openDeleteDialog = () => {
    dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
    dispatch(updatePostItem(post));
  };

  const getBackgroundImageColor = async (post) => {
    let imageUrl = "";
    if (post?.imgId && !post?.gifUrl && post.bgColor === "#ffffff") {
      imageUrl = Utils.getImage(post.imgId, post.imgVersion);
    } else if (post?.gifUrl && post.bgColor === "#ffffff") {
      imageUrl = post?.gifUrl;
    }
    const bgColor = await ImageUtils.getBackgroundImageColor(imageUrl);
    setBackgroundImageColor(bgColor);
  };
  const loadEditor = async (text) => {
    const blocks = await editor.tryParseHTMLToBlocks(text);
    editor.replaceBlocks(editor.document, blocks);
  };
  useEffect(() => {
    getBackgroundImageColor(post);
    loadEditor(post.htmlPost || "");
  }, [post]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hàm xử lý khi click vào khu vực BlockNoteView
  const handleContentClick = useCallback((event) => {
    // Kiểm tra xem phần tử được click có phải là thẻ IMG không
    if (event.target.tagName === 'IMG') {
      const clickedImageSrc = event.target.src;
      if (clickedImageSrc) {
        setCurrentImageSrc(clickedImageSrc);
        setLightboxOpen(true);
      }
    }
  }, []);

  // Gắn và gỡ bỏ event listener bằng useEffect
  useEffect(() => {
    const container = viewContainerRef.current;
    if (container) {
      // Gắn listener vào container
      container.addEventListener('click', handleContentClick);
    }

    // Cleanup listener khi component unmount
    return () => {
      if (container) {
        container.removeEventListener('click', handleContentClick);
      }
    };
  }, [handleContentClick]);

  return (
    <>
      {reactionsModalIsOpen && selectedPostReactId === post?._id && (
        <ReactionsModal />
      )}
      {commentsModalIsOpen && selectedPostCommentId === post?._id && (
        <CommentsModal />
      )}
      {showImageModal && (
        <ImageModal
          image={`${imageUrl}`}
          onCancel={() => setShowImageModal(!showImageModal)}
          showArrow={false}
        />
      )}
      {deleteDialogIsOpen && (
        <Dialog
          title="Are you sure you want to delete this post?"
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstBtnHandler={() => deletePost()}
          secondBtnHandler={() => {
            dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
            dispatch(clearPost());
          }}
        />
      )}
      <div className="post-body" data-testid="post">
        <div className="user-post-data">
          <div className="user-post-data-wrap">
            <div className="user-post-image">
              <Avatar
                name={post?.username}
                bgColor={post?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={post?.profilePicture}
              />
            </div>
            <div className="user-post-info">
              <div className="inline-title-display">
                <h5 data-testid="username">
                  {post?.username}
                  {post?.feelings && (
                    <p className="inline-display" data-testid="box-feeling">
                      is feeling{" "}
                      <img
                        className="inline-block w-5 h-4 align-middle mx-1"
                        src={`${getFeeling(post?.feelings)}`}
                        alt=""
                      />
                      <span className="font-semibold">{post?.feelings}</span>
                    </p>
                    // <div
                    //   className="inline-display"
                    //   data-testid="inline-display"
                    // >
                    //   is feeling{" "}
                    //   <img
                    //     className="feeling-icon"
                    //     src={`${getFeeling(post?.feelings)}`}
                    //     alt=""
                    //   />{" "}
                    //   <div>{post?.feelings}</div>
                    // </div>
                  )}
                </h5>
                {(showIcons || post.userId === profile._id)  && (
                  <div
                    className="post-icons"
                    style={{ position: "relative" }}
                    ref={menuRef}
                  >
                    <div
                      onClick={() => setShowOptionsMenu((prev) => !prev)}
                      style={{ cursor: "pointer", fontSize: "18px" }}
                    >
                      &#8942;
                    </div>

                    {showOptionsMenu && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "6px",
                          zIndex: 10,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          width: "140px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 14px",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                          onClick={() => {
                            openPostModal();
                            setShowOptionsMenu(false);
                          }}
                        >
                          <span
                            role="img"
                            aria-label="edit"
                            style={{ fontSize: "18px" }}
                          >
                            ✏️
                          </span>
                          <span>Edit</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 14px",
                            cursor: "pointer",
                            fontSize: "15px",
                            color: "red",
                          }}
                          onClick={() => {
                            openDeleteDialog();
                            setShowOptionsMenu(false);
                          }}
                        >
                          <span
                            role="img"
                            aria-label="delete"
                            style={{ fontSize: "18px" }}
                          >
                            🗑️
                          </span>
                          <span>Delete</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {post?.createdAt && (
                <p className="time-text-display" data-testid="time-display">
                  <Link
                    to={`/app/social/post/${post._id}`}
                    className="time-link"
                  >
                    {timeAgo.transform(post?.createdAt)}
                  </Link>
                  &nbsp;&middot; {getPrivacy(post?.privacy)}
                </p>
              )}
            </div>

            <hr />
            <div
              className="user-post"
              style={{ marginTop: "0.5rem", borderBottom: "" }}
            >
              {post.htmlPost && (
                <span className="post" data-testid="user-post" ref={viewContainerRef}>
                  <BlockNoteView
                    editor={editor}
                    editable={false} // Ngăn chặn chỉnh sửa
                    className="my-blocknote"
                    data-color-scheme="light"
                    data-mantine-color-scheme="light"
                  />

                  <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={[{ src: currentImageSrc }]} // chỉ hiển thị ảnh hiện tại
                    // Thêm các plugin nếu muốn (zoom, fullscreen,...)
                    plugins={[Zoom]}
                    on={{ click: handleContentClick }} // Gọi lại hàm khi mở lightbox
                  />
                </span>
              )}
              {!post.htmlPost && (
                <>
                  {post?.post && post?.bgColor === "#ffffff" && (
                    <p className="post" data-testid="user-post">
                      {post?.post}
                    </p>
                  )}
                  {post?.post && post?.bgColor !== "#ffffff" && (
                    <div
                      data-testid="user-post-with-bg"
                      className="user-post-with-bg"
                      style={{ backgroundColor: `${post?.bgColor}` }}
                    >
                      {post?.post}
                    </div>
                  )}

                  {post?.imgId &&
                    !post?.gifUrl &&
                    post.bgColor === "#ffffff" && (
                      <div
                        data-testid="post-image"
                        className="image-display-flex"
                        style={{
                          height: "auto",
                          backgroundColor: `${backgroundImageColor}`,
                        }}
                        onClick={() => {
                          setImageUrl(
                            Utils.getImage(post.imgId, post.imgVersion)
                          );
                          setShowImageModal(!showImageModal);
                        }}
                      >
                        <img
                          className="post-image"
                          style={{ objectFit: "contain" }}
                          src={`${Utils.getImage(post.imgId, post.imgVersion)}`}
                          alt=""
                        />
                      </div>
                    )}

                  {post?.videoId && post.bgColor === "#ffffff" && (
                    <div
                      data-testid="post-image"
                      className="image-display-flex"
                      style={{ height: "600px", backgroundColor: "#000000" }}
                    >
                      <video
                        width="100%"
                        height="600px"
                        autoPlay
                        controls
                        src={`${Utils.getVideo(
                          post.videoId,
                          post.videoVersion
                        )}`}
                      />
                    </div>
                  )}

                  {post?.gifUrl && post.bgColor === "#ffffff" && (
                    <div
                      className="image-display-flex"
                      style={{
                        height: "600px",
                        backgroundColor: `${backgroundImageColor}`,
                      }}
                      onClick={() => {
                        setImageUrl(post?.gifUrl);
                        setShowImageModal(!showImageModal);
                      }}
                    >
                      <img
                        className="post-image"
                        style={{ objectFit: "contain" }}
                        src={`${post?.gifUrl}`}
                        alt=""
                      />
                    </div>
                  )}
                </>
              )}

              {((Object.values(post?.reactions || {}).reduce((a, b) => a + b, 0) > 0) || post?.commentsCount > 0) && (
                <hr style={{marginTop: "0.5rem"}}/>
              )}
              <PostCommentSection post={post} />
            </div>
          </div>
          {selectedPostId === post?._id && <CommentInputBox post={post} />}
        </div>
      </div>
    </>
  );
};
Post.propTypes = {
  post: PropTypes.object.isRequired,
  showIcons: PropTypes.bool,
};
export default Post;
