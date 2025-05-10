import PropTypes from "prop-types";
import CommentInputBox from "@components/posts/comments/comment-input/CommentInputBox";
import Avatar from "@components/avatar/Avatar";
import { useSelector } from "react-redux";

const CommentInput = ({ post, onCommentAdded }) => {
    const { profile } = useSelector((state) => state.user);

    return (
        <div className="sticky bottom-0 left-0 right-0 bg-white pt-3 pb-3 border-t border-gray-100 mt-4 backdrop-blur-[2px] transition-all duration-300">
            <div className="flex flex-col">
                <div className="hidden sm:flex items-center justify-center mb-1">
                    <span className="text-xs text-gray-400 px-2 py-0.5 rounded-full">
                        Press Enter to send • ESC to cancel
                    </span>
                </div>

                <div className="flex items-center gap-3 px-2 mx-auto max-w-3xl w-full ">
                    <div className="flex-shrink-0 transition-transform hover:scale-105">
                        <Avatar
                            name={profile?.username}
                            bgColor={profile?.avatarColor}
                            textColor="#ffffff"
                            size={38}
                            avatarSrc={profile?.profilePicture}
                        />
                    </div>
                    <div className="flex-1  rounded-full hover:shadow-md transition-shadow duration-300">
                        <CommentInputBox
                            post={post}
                            onCommentAdded={onCommentAdded}
                            placeholder="Add a comment..."
                            className="rounded-full border-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

CommentInput.propTypes = {
    post: PropTypes.object.isRequired,
    onCommentAdded: PropTypes.func.isRequired,
};

export default CommentInput;
