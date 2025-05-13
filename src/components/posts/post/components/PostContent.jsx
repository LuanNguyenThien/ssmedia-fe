import PropTypes from "prop-types";
import { BlockNoteView } from "@blocknote/mantine";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Utils } from "@services/utils/utils.service";

const PostContent = ({
    post,
    editor,
    viewContainerRef,
    lightboxOpen,
    setLightboxOpen,
    currentImageSrc,
    handleContentClick,
    backgroundImageColor,
    setImageUrl,
    setShowImageModal,
    showImageModal,
}) => (
    <div className="user-post relative">
        {post.htmlPost && (
            <span
                className="post"
                data-testid="user-post"
                ref={viewContainerRef}
            >
                <BlockNoteView
                    editor={editor}
                    editable={false}
                    className="my-blocknote"
                    data-color-scheme="light"
                    data-mantine-color-scheme="light"
                />
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={[{ src: currentImageSrc }]}
                    plugins={[Zoom]}
                    on={{ click: handleContentClick }}
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
                    >
                        {post?.post}
                    </div>
                )}
                {post?.imgId && !post?.gifUrl && post.bgColor === "#ffffff" && (
                    <div
                        data-testid="post-image"
                        className="image-display-flex flex justify-center"
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
                            className="post-image w-max h-[400px] max-h-[400px]"
                            style={{ objectFit: "contain" }}
                            src={`${Utils.getImage(
                                post.imgId,
                                post.imgVersion
                            )}`}
                            alt=""
                        />
                    </div>
                )}
                {post?.videoId && post.bgColor === "#ffffff" && (
                    <div
                        data-testid="post-image"
                        className="image-display-flex bg-primary-white max-h-max"
                    >
                        <video
                            width="100%"
                            height="600px"
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
    </div>
);

PostContent.propTypes = {
    post: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    viewContainerRef: PropTypes.object.isRequired,
    lightboxOpen: PropTypes.bool.isRequired,
    setLightboxOpen: PropTypes.func.isRequired,
    currentImageSrc: PropTypes.string.isRequired,
    handleContentClick: PropTypes.func.isRequired,
    backgroundImageColor: PropTypes.string.isRequired,
    setImageUrl: PropTypes.func.isRequired,
    setShowImageModal: PropTypes.func.isRequired,
    showImageModal: PropTypes.bool.isRequired,
};

export default PostContent;
