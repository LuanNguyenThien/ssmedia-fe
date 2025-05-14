import Avatar from "@components/avatar/Avatar";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { commentService } from "@services/api/comment/comment.service";
import { useSelector, useDispatch } from "react-redux";
import { Utils } from "@services/utils/utils.service";

const CommentItem = ({
    comment,
    onToggleReplies,
    showReplies = false,
    onReply,
    isReply = false,
    onCommentUpdated,
    postId
}) => {
    const { profile } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [userReaction, setUserReaction] = useState(null);
    const [reactions, setReactions] = useState({
        upvote: comment?.reactions?.upvote || 0,
        downvote: comment?.reactions?.downvote || 0
    });
    const [loading, setLoading] = useState(false);
    
    const timeAgo = comment?.createdAt
        ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: false })
        : "Just now";
    
    // Fetch user's reaction to this comment
    useEffect(() => {
        const fetchUserReaction = async () => {
            try {
                if (!comment?._id) return;
                const { data } = await commentService.getUserReaction(comment._id);
                setUserReaction(data.reaction);
            } catch (error) {
                console.error('Error fetching user reaction:', error);
            }
        };

        if (profile) {
            fetchUserReaction();
        }
    }, [comment?._id, profile]);

    // Update reactions whenever comment changes
    useEffect(() => {
        if (comment?.reactions) {
            setReactions({
                upvote: comment.reactions.upvote || 0,
                downvote: comment.reactions.downvote || 0
            });
        }
    }, [comment?.reactions]);

    const handleReaction = async (type) => {
        if (loading) return;
        
        if (!profile) {
            Utils.dispatchNotification(
                'Please log in to react to comments',
                'error',
                dispatch
            );
            return;
        }

        try {
            setLoading(true);
            
            // Determine if we're adding or removing a reaction
            let reactionType = type;
            
            // If the user is clicking the same reaction they already have, remove it
            if (userReaction === type) {
                reactionType = `${type}-remove`;
            }
            
            // Send the reaction to the server
            await commentService.addReaction({
                commentId: comment._id,
                postId: postId,
                reaction: reactionType,
                profilePicture: profile.profilePicture
            });
            
            // Update local state optimistically
            if (userReaction === type) {
                // Remove the reaction
                setUserReaction(null);
                setReactions(prev => ({
                    ...prev,
                    [type]: Math.max(0, prev[type] - 1)
                }));
            } else if (userReaction) {
                // Change reaction type
                setUserReaction(type);
                setReactions(prev => ({
                    upvote: type === 'upvote' ? prev.upvote + 1 : Math.max(0, prev.upvote - (userReaction === 'upvote' ? 1 : 0)),
                    downvote: type === 'downvote' ? prev.downvote + 1 : Math.max(0, prev.downvote - (userReaction === 'downvote' ? 1 : 0))
                }));
            } else {
                // Add new reaction
                setUserReaction(type);
                setReactions(prev => ({
                    ...prev,
                    [type]: prev[type] + 1
                }));
            }
            
            // Callback to update parent component if needed
            if (onCommentUpdated) {
                onCommentUpdated();
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || 'Failed to update reaction',
                'error',
                dispatch
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (loading) return;

        try {
            setLoading(true);
            await commentService.deleteComment(comment._id);
            Utils.dispatchNotification('Comment deleted successfully', 'success', dispatch);
            
            if (onCommentUpdated) {
                onCommentUpdated();
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || 'Failed to delete comment',
                'error',
                dispatch
            );
        } finally {
            setLoading(false);
        }
    };

    const isCommentOwner = profile?.username === comment?.username;
        
    return (
        <li
            className="pb-2 last:pb-0 group transition-all duration-200"
            data-testid="modal-list-item"
        >
            <div className="flex gap-3 relative">
                <div className="flex-shrink-0 transition-transform hover:scale-105">
                    <Avatar
                        name={comment?.username}
                        bgColor={comment?.avatarColor}
                        textColor="#ffffff"
                        size={45}
                        avatarSrc={comment?.profilePicture}
                    />
                </div>
                <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 relative hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center mb-1.5">
                            <span className="font-semibold text-gray-900 mr-2 hover:underline">
                                {comment?.username}
                            </span>
                            <span className="text-gray-500 text-xs">{timeAgo}</span>
                            
                            {isCommentOwner && (
                                <button 
                                    onClick={handleDelete}
                                    className="ml-auto text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                    disabled={loading}
                                    aria-label="Delete comment"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <p className="text-gray-800 text-base mb-2 break-words">
                            {comment?.comment}
                        </p>

                        {comment?.selectedImage && (
                            <div className="mb-2 mt-3">
                                <img
                                    src={comment.selectedImage}
                                    alt="Comment"
                                    className="max-w-full rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-5 mt-2 ml-3">
                        <button 
                            onClick={() => handleReaction('upvote')}
                            className={`flex items-center gap-1.5 rounded-full px-2 py-1 transition-all duration-200 
                                ${userReaction === 'upvote' 
                                    ? 'text-blue-500 font-medium bg-blue-50' 
                                    : 'text-gray-500 hover:bg-gray-100'}`}
                            disabled={loading}
                            aria-label="Upvote"
                        >
                            <svg className="w-4 h-4" fill={userReaction === 'upvote' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                            <span className="text-sm">{reactions.upvote}</span>
                        </button>

                        <button 
                            onClick={() => handleReaction('downvote')}
                            className={`flex items-center gap-1.5 rounded-full px-2 py-1 transition-all duration-200
                                ${userReaction === 'downvote' 
                                    ? 'text-red-500 font-medium bg-red-50' 
                                    : 'text-gray-500 hover:bg-gray-100'}`}
                            disabled={loading}
                            aria-label="Downvote"
                        >
                            <svg className="w-4 h-4" fill={userReaction === 'downvote' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-sm">{reactions.downvote}</span>
                        </button>

                        {/* Only show reply button for top-level comments, not for replies */}
                        {!isReply && (
                            <button
                                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200"
                                onClick={() =>
                                    onReply
                                        ? onReply(comment)
                                        : onToggleReplies &&
                                          onToggleReplies(comment._id)
                                }
                                aria-label="Reply to comment"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                    />
                                </svg>
                                <span className="text-sm">Reply</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showReplies && (
                <div className="ml-14 mt-4 pl-4 border-l-2 border-gray-100">
                    {/* Reply content will be rendered here by CommentList */}
                </div>
            )}
        </li>
    );
};

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    onToggleReplies: PropTypes.func,
    showReplies: PropTypes.bool,
    onReply: PropTypes.func,
    isReply: PropTypes.bool,
    onCommentUpdated: PropTypes.func,
    postId: PropTypes.string
};

export default CommentItem;
