import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
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
}) => {
    // Separate state for HTML posts and regular posts
    const [isHtmlExpanded, setIsHtmlExpanded] = useState(false);
    const [showHtmlToggle, setShowHtmlToggle] = useState(false);
    const [isRegularExpanded, setIsRegularExpanded] = useState(false);
    const [showRegularToggle, setShowRegularToggle] = useState(false);
    
    // Separate refs for different content types
    const htmlContentRef = useRef(null);
    const regularContentRef = useRef(null);
    
    const MAX_HEIGHT = 500; // Maximum height in pixels before showing "see more"

    // Check HTML content height
    useEffect(() => {
        if (post.htmlPost && htmlContentRef.current) {
            // Wait for BlockNoteView to render completely
            const checkHeight = () => {
                if (htmlContentRef.current) {
                    const contentHeight = htmlContentRef.current.scrollHeight;
                    
                    // Try multiple selectors to find BlockNote content
                    const blockNoteSelectors = [
                        '.bn-editor',
                        '.ProseMirror',
                        '.bn-block-content',
                        '.blocknote-editor',
                        '[data-node-type]'
                    ];
                    
                    let blockNoteContent = null;
                    for (const selector of blockNoteSelectors) {
                        blockNoteContent = htmlContentRef.current.querySelector(selector);
                        if (blockNoteContent) break;
                    }
                    
                    // Check both the container and the BlockNote editor content
                    let actualHeight = contentHeight;
                    if (blockNoteContent) {
                        actualHeight = Math.max(contentHeight, blockNoteContent.scrollHeight);
                        
                        // If BlockNote content has children, check their total height too
                        const children = blockNoteContent.children;
                        if (children.length > 0) {
                            let childrenHeight = 0;
                            for (let child of children) {
                                childrenHeight += child.offsetHeight;
                            }
                            actualHeight = Math.max(actualHeight, childrenHeight);
                        }
                    }
                    
                    // console.log('HTML Content Height Check:', {
                    //     containerHeight: contentHeight,
                    //     blockNoteHeight: blockNoteContent?.scrollHeight,
                    //     actualHeight,
                    //     threshold: MAX_HEIGHT,
                    //     willShow: actualHeight > MAX_HEIGHT
                    // });
                    
                    setShowHtmlToggle(actualHeight > MAX_HEIGHT);
                }
            };

            // Initial check with delay to allow BlockNote to render
            const timeoutId = setTimeout(checkHeight, 100);
            
            // Check again after a longer delay to be sure
            const secondTimeoutId = setTimeout(checkHeight, 500);
            
            // Final check after an even longer delay
            const thirdTimeoutId = setTimeout(checkHeight, 1000);
            
            // Also observe for content changes in BlockNote
            let observer;
            let resizeObserver;
            
            if (htmlContentRef.current) {
                // Mutation observer for DOM changes
                observer = new MutationObserver(checkHeight);
                observer.observe(htmlContentRef.current, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });

                // Resize observer for size changes
                resizeObserver = new ResizeObserver(checkHeight);
                resizeObserver.observe(htmlContentRef.current);
            }

            return () => {
                clearTimeout(timeoutId);
                clearTimeout(secondTimeoutId);
                clearTimeout(thirdTimeoutId);
                if (observer) {
                    observer.disconnect();
                }
                if (resizeObserver) {
                    resizeObserver.disconnect();
                }
            };
        }
    }, [post.htmlPost, editor]);

    // Check regular content height  
    useEffect(() => {
        if (!post.htmlPost && regularContentRef.current) {
            const checkHeight = () => {
                if (regularContentRef.current) {
                    const contentHeight = regularContentRef.current.scrollHeight;
                    setShowRegularToggle(contentHeight > MAX_HEIGHT);
                }
            };

            // Small delay to ensure content is rendered
            const timeoutId = setTimeout(checkHeight, 50);
            
            return () => clearTimeout(timeoutId);
        }
    }, [post, post.htmlPost]);

    const handleHtmlToggleExpand = () => {
        setIsHtmlExpanded(!isHtmlExpanded);
    };

    const handleRegularToggleExpand = () => {
        setIsRegularExpanded(!isRegularExpanded);
    };

    return (
        <div className="user-post relative">
            {post.htmlPost && (
                <span
                    className="post"
                    data-testid="user-post"
                    ref={viewContainerRef}
                >
                    <div
                        ref={htmlContentRef}
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            !isHtmlExpanded && showHtmlToggle 
                                ? '' 
                                : ''
                        }`}
                        style={{
                            maxHeight: !isHtmlExpanded && showHtmlToggle ? `${MAX_HEIGHT}px` : 'none'
                        }}
                    >
                        <BlockNoteView
                            editor={editor}
                            editable={false}
                            className="my-blocknote"
                            data-color-scheme="light"
                            data-mantine-color-scheme="light"
                        />
                    </div>
                    {showHtmlToggle && (
                        <button
                            onClick={handleHtmlToggleExpand}
                            className="mt-2 text-primary-black hover:text-gray-700 font-extrabold text-sm transition-colors duration-200 bg-transparent border-none cursor-pointer"
                            aria-label={isHtmlExpanded ? "Show less content" : "Show more content"}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleHtmlToggleExpand();
                                }
                            }}
                        >
                            {isHtmlExpanded ? "Show less" : "... See more"}
                        </button>
                    )}
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
                <div className="relative">
                    <div
                        ref={regularContentRef}
                        className={`transition-all duration-300 ease-in-out overflow-hidden`}
                        style={{
                            maxHeight: !isRegularExpanded && showRegularToggle ? `${MAX_HEIGHT}px` : 'none'
                        }}
                    >
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
                                    className="post-image w-max h-auto max-h-[400px]"
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
                                    className="post-image w-full h-auto max-h-[400px]"
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
                                className="image-display-flex bg-primary-white max-h-max"
                                style={{
                                    backgroundColor: `${backgroundImageColor}`,
                                }}
                                onClick={() => {
                                    setImageUrl(post?.gifUrl);
                                    setShowImageModal(!showImageModal);
                                }}
                            >
                                <img
                                    className="post-image w-full h-auto max-h-[400px]"
                                    style={{ objectFit: "contain" }}
                                    src={`${post?.gifUrl}`}
                                    alt=""
                                />
                            </div>
                        )}
                    </div>
                    {showRegularToggle && (
                        <button
                            onClick={handleRegularToggleExpand}
                            className="mt-2 text-primary-black hover:text-gray-700 font-extrabold text-sm transition-colors duration-200 bg-transparent border-none cursor-pointer"
                            aria-label={isRegularExpanded ? "Show less content" : "Show more content"}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleRegularToggleExpand();
                                }
                            }}
                        >
                            {isRegularExpanded ? "Show less" : "... See more"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

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
