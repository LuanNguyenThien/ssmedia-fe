import PropTypes from "prop-types";
import "@components/dialog/NotificationPreview.scss";
import { FaCircleArrowUp, FaCircleArrowDown } from "react-icons/fa6";
import { FaExclamationTriangle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { RiLinksFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const NotificationPreview = ({
    post,
    htmlPost,
    imgUrl,
    comment,
    reaction,
    post_analysis,
    senderName,
    entityId,
    secondButtonText,
    secondBtnHandler,
}) => {
    const enhancedHtmlPost = htmlPost
        ?.replace(/<audio/g, '<audio controls preload="metadata"')
        .replace(/<video/g, '<video controls preload="metadata" style="max-width: 100%; height: auto;"');
    const navigate = useNavigate();

    const handleGoToPost = () => {
        navigate(`/app/social/post/${entityId}`);
        secondBtnHandler();
    };
    const responsiveModal = `
    w-[90vw] max-w-[90vw] max-h-[80dvh]
    sm:w-[60vw] sm:max-h-[70dvh]
    lg:w-full lg:max-h-[50dvh]
  `;
    return (
        <>
            <div
                className="notification-preview-container z-[5001] size-[100%] fixed inset-0 bg-primary-black/20 flex justify-center items-center"
                data-testid="notification-preview"
            >
                <div
                    className={`dialog flex flex-col gap-2 bg-white max-w-2xl p-5 backdrop-blur-sm rounded-md shadow-lg`}
                >
                    <div
                        className={`w-full h-max text-center font-bold text-xl flex justify-between items-center `}
                    >
                        {/* <span className="w-max h-max">Review your post</span> */}

                        <span
                            onClick={handleGoToPost}
                            className="text-sm font-normal cursor-pointer text-primary-black hover:text-primary/70 flex items-center gap-1"
                        >
                            <RiLinksFill /> Move to this post
                        </span>

                        <div
                            onClick={secondBtnHandler}
                            className="w-max p-2 text-2xl rounded-full cursor-pointer hover:text-red-500 flex justify-center items-center gap-2"
                        >
                            <RxCross2 />
                        </div>
                    </div>
                    <div
                        className={`dialog-body flex flex-col p-[20px] sm:p-[20px] overflow-y-scroll justify-center items-center w-full h-max  rounded-md bg-background-blur/50 $ ${responsiveModal}`}
                    >
                        {post && !htmlPost && (
                            <span className="dialog-body-post text-primary-black text-xl">
                                {post}
                            </span>
                        )}
                        {imgUrl && !htmlPost && (
                            <img
                                className="dialog-body-img h-[200px] w-auto max-w-[300px] rounded-md"
                                src={imgUrl}
                                alt=""
                            />
                        )}
                        {htmlPost && (
                            <div
                                className="dialog-body-html-post text-primary-black text-xl h-full overflow-scroll"
                                dangerouslySetInnerHTML={{ __html: enhancedHtmlPost }}
                            />
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2 w-full">
                        {post_analysis && (
                            <span className="dialog-body-post-analysis text-primary-black text-sm font-normal max-h-[100px] overflow-scroll flex gap-2">
                                <FaExclamationTriangle className="text-red-500 flex-shrink-0 text-lg animate-pulse" /> 
                                {post_analysis}
                            </span>
                        )}
                        {comment && (
                            <span className="dialog-body-comment truncate w-full">
                                <span className="dialog-body-reaction-text">
                                    <span className="font-bold">
                                        {senderName}
                                    </span>{" "}
                                    comment on your post:
                                </span>
                                {comment}
                            </span>
                        )}
                        {reaction && (
                            <div
                                className="dialog-body-reaction"
                                data-testid="reaction"
                            >
                                <span className="dialog-body-reaction-text">
                                    <span className="font-bold">
                                        {senderName}
                                    </span>{" "}
                                    has give you
                                </span>

                                <span className="dialog-body-reaction-text reaction-text">
                                    {reaction === "upvote" ? (
                                        <span className="flex items-center gap-1">
                                            an upvote
                                            <FaCircleArrowUp className="text-green-500" />
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            a downvote
                                            <FaCircleArrowDown className="text-red-500" />
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

NotificationPreview.propTypes = {
    post: PropTypes.string,
    imgUrl: PropTypes.string,
    title: PropTypes.string,
    comment: PropTypes.string,
    reaction: PropTypes.string,
    senderName: PropTypes.string,
    secondButtonText: PropTypes.string,
    secondBtnHandler: PropTypes.func,
};

export default NotificationPreview;
