import useEffectOnce from "@hooks/useEffectOnce";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import components
import CommentHeader from "./components/CommentHeader";
import CommentList from "./components/CommentList";
import CommentInput from "./components/CommentInput";

const CommentsModal = () => {
    const { post } = useSelector((state) => state);
    const [postComments, setPostComments] = useState([]);
    const [openReplies, setOpenReplies] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const dispatch = useDispatch();

    // Reset openReplies when post changes
    useEffect(() => {
        if (post?._id !== currentPostId) {
            setOpenReplies({});
            setCurrentPostId(post?._id);
        }
    }, [post?._id, currentPostId]);

    const getPostComments = useCallback(async () => {
        if (!post?._id) return;
        
        try {
            setLoading(true);
            const response = await postService.getPostComments(post._id);
            
            // Make sure each comment has a reactions object
            const commentsWithReactions = response.data?.comments?.map(
                (comment) => ({
                    ...comment,
                    reactions: comment.reactions || { upvote: 0, downvote: 0 },
                })
            ) || [];
            
            setPostComments(commentsWithReactions);
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error loading comments",
                "error",
                dispatch
            );
        } finally {
            setLoading(false);
        }
    }, [post?._id, dispatch]);

    const toggleReplies = useCallback((commentId) => {
        setOpenReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    }, []);

    const handleCommentAdded = useCallback(async () => {
        await getPostComments();
    }, [getPostComments]);

    useEffectOnce(() => {
        getPostComments();
    });

    // Calculate comment count from top-level comments only
    const commentCount = postComments.filter(
        (comment) => comment && comment.parentId === null
    ).length;

    return (
        <section className="w-full bg-white px-2 sm:px-6 py-4">
            <CommentHeader title="Comments" commentCount={commentCount} />

            <div className="max-h-[500px] overflow-y-auto mb-16">
                {loading && postComments.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : postComments.length > 0 ? (
                    <CommentList
                        comments={postComments}
                        openReplies={openReplies}
                        toggleReplies={toggleReplies}
                        post={post}
                        onCommentAdded={handleCommentAdded}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No comments yet. Be the first to comment!
                    </div>
                )}
            </div>

            <CommentInput post={post} onCommentAdded={handleCommentAdded} />
        </section>
    );
};

export default CommentsModal;
