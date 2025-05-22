import { useRef, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import "@components/posts/post/Post.scss";

// BlockNote
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "yet-another-react-lightbox/styles.css";
import { useCreateBlockNote } from "@blocknote/react";

import { Utils } from "@services/utils/utils.service";
import { ImageUtils } from "@services/utils/image-utils.service";
import { postService } from "@services/api/post/post.service";
import useLocalStorage from "@hooks/useLocalStorage";
import ReactionsModal from "@components/posts/reactions/reactions-modal/ReactionsModal";
import CommentsModal from "@components/posts/comments/comments-modal/CommentsModal";
import ImageModal from "@components/image-modal/ImageModal";
import Dialog from "@components/dialog/Dialog";
import PostVoteBar from "./components/PostVoteBar";
import PostContent from "./components/PostContent";
import PostMetaRow from "./components/PostMetaRow";
import { toggleDeleteDialog } from "@redux/reducers/modal/modal.reducer";

const Post = ({ post }) => {
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const { reactionsModalIsOpen, commentsModalIsOpen, deleteDialogIsOpen, deleteDialogType, data } = useSelector(
        (state) => state.modal
    );
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState("");
    const viewContainerRef = useRef(null);
    const { _id } = useSelector((state) => state.post);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [backgroundImageColor, setBackgroundImageColor] = useState("");
    useLocalStorage("selectedPostId", "get");
    const selectedPostCommentId = useLocalStorage(
        "selectedPostCommentId",
        "get"
    );
    const selectedPostReactId = useLocalStorage("selectedPostReactId", "get");
    const editor = useCreateBlockNote();

    const handleDeletePost = async () => {
        try {
            await postService.deletePost(post._id);
            Utils.dispatchNotification("Post deleted successfully", "success", dispatch);
            dispatch(toggleDeleteDialog({ toggle: false, dialogType: '' }));
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to delete post",
                "error",
                dispatch
            );
        }
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
                // setShowOptionsMenu(false); // Removed undefined function
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
        if (event.target.tagName === "IMG") {
            const clickedImageSrc = event.target.src;
            if (clickedImageSrc) {
                setCurrentImageSrc(clickedImageSrc);
                setLightboxOpen(true);
            }
        }
    }, []);

    useEffect(() => {
        const container = viewContainerRef.current;
        if (container) {
            // Gắn listener vào container
            container.addEventListener("click", handleContentClick);
        }

        // Cleanup listener khi component unmount
        return () => {
            if (container) {
                container.removeEventListener("click", handleContentClick);
            }
        };
    }, [handleContentClick]);

    return (
        <>
            {reactionsModalIsOpen && selectedPostReactId === post?._id && (
                <ReactionsModal />
            )}
            {showImageModal && (
                <ImageModal
                    image={`${imageUrl}`}
                    onCancel={() => setShowImageModal(!showImageModal)}
                    showArrow={false}
                />
            )}
            {deleteDialogIsOpen && deleteDialogType === 'post' && data && data._id === post?._id && (
                <Dialog
                    title="Are you sure you want to delete this post?"
                    firstButtonText="Delete"
                    secondButtonText="Cancel"
                    firstBtnHandler={handleDeletePost}
                    secondBtnHandler={() => dispatch(toggleDeleteDialog({ toggle: false }))}
                />
            )}
            <div
                className={`post-card flex bg-white shadow p-4 md:p-6 md:gap-6 flex-col md:flex-row ${
                    commentsModalIsOpen && selectedPostCommentId === post?._id
                        ? "sm:rounded-t-xl"
                        : "sm:rounded-xl"
                }`}
            >
                {/* Desktop only: Vote bar on the left */}
                <div className="hidden md:block md:flex-shrink-0 ">
                    <PostVoteBar post={post} />
                </div>

                {/* Post content */}
                <div className="post-content flex-1 min-w-0">
                    <div
                        className="post-body min-h-full flex flex-col justify-between bg-background rounded-3xl"
                        data-testid="post"
                    >
                        <PostContent
                            post={post}
                            editor={editor}
                            viewContainerRef={viewContainerRef}
                            lightboxOpen={lightboxOpen}
                            setLightboxOpen={setLightboxOpen}
                            currentImageSrc={currentImageSrc}
                            handleContentClick={handleContentClick}
                            backgroundImageColor={backgroundImageColor}
                            setImageUrl={setImageUrl}
                            setShowImageModal={setShowImageModal}
                            showImageModal={showImageModal}
                        />

                        {/* Mobile only: Vote bar above meta row */}
                        <div className="flex md:hidden w-full items-center mt-3 mb-1">
                            <div className="mobile-vote-bar border rounded-full py-1 px-1">
                                <PostVoteBar post={post} />
                            </div>
                        </div>

                        <PostMetaRow post={post} />
                    </div>
                </div>
            </div>
            {commentsModalIsOpen && selectedPostCommentId === post?._id && (
                <div
                    className="bg-white rounded-b-xl overflow-hidden border-t border-gray-100 shadow-sm"
                    style={{ marginTop: "-1px" }}
                >
                    <CommentsModal />
                </div>
            )}
        </>
    );
};
Post.propTypes = {
    post: PropTypes.object.isRequired,
};
export default Post;
