import Post from "@/components/posts/post/Post";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";
import useEffectOnce from "@hooks/useEffectOnce";
import { PostUtils } from "@services/utils/post-utils.service";
import { Utils } from "@services/utils/utils.service";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import useLocalStorage from "@hooks/useLocalStorage";
import { postService } from "@services/api/post/post.service";
import { userService } from "@services/api/user/user.service";
import { followerService } from "@services/api/followers/follower.service";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";
import { socketService } from "@services/socket/socket.service";

import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

const TimelineAnswers = ({ loading: initialLoading }) => {
    const { profile } = useSelector((state) => state.user);
    const [answers, setAnswers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);
    
    const { username } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const storedUsername = useLocalStorage("username", "get");
    const navigate = useNavigate();

    const navigateToQuestion = (questionId) => {
        navigate(`/app/social/question/${questionId}`);
    };

    // Get user following để check privacy
    const getUserFollowing = useCallback(async () => {
        try {
            const response = await followerService.getUserFollowing();
            setFollowing(response.data.following);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    }, [dispatch]);

    // Load answers của user
    const loadUserAnswers = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const userId = searchParams.get("id");
            const uId = searchParams.get("uId");
            
            if (!userId || !uId) {
                setLoading(false);
                return;
            }

            const response = await userService.getUserAnswers(userId, username, uId, page);
            
            if (page === 1) {
                setAnswers(response.data.answers);
            } else {
                setAnswers(prev => [...prev, ...response.data.answers]);
            }
            
            setHasMoreAnswers(response.data.answers.length === 10);
        } catch (error) {
            console.error("Error loading answers:", error);
            Utils.dispatchNotification(
                error.response?.data?.message || "Error loading answers",
                "error",
                dispatch
            );
        } finally {
            setLoading(false);
        }
    }, [username, searchParams, dispatch]);

    // Get reactions by username
    const getReactionsByUsername = useCallback(async () => {
        try {
            const reactionsResponse = await postService.getReactionsByUsername(storedUsername);
            dispatch(addReactions(reactionsResponse.data.reactions));
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    }, [storedUsername, dispatch]);

    // Load more answers
    const loadMoreAnswers = useCallback(() => {
        if (!loading && hasMoreAnswers) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadUserAnswers(nextPage);
        }
    }, [currentPage, loading, hasMoreAnswers, loadUserAnswers]);

    // Initial load
    useEffectOnce(() => {
        getUserFollowing();
        getReactionsByUsername();
    });

    // Load answers when username/params change
    useEffect(() => {
        setCurrentPage(1);
        loadUserAnswers(1);
    }, [loadUserAnswers]);

    // Socket handlers cho hide/unhide posts
    useEffect(() => {
        const handleHidePost = ({ postId }) => {
            setAnswers((prevAnswers) =>
                prevAnswers.filter((answer) => answer._id !== postId)
            );
        };

        const handleUnhidePost = async ({ postId }) => {
            try {
                const response = await postService.getPost(postId);
                const newAnswer = response.data.post;

                if (newAnswer.type === 'answer') {
                    setAnswers((prevAnswers) => {
                        const exists = prevAnswers.find((a) => a._id === newAnswer._id);
                        if (exists) return prevAnswers;
                        return [newAnswer, ...prevAnswers];
                    });
                }
            } catch (error) {
                console.error("Failed to unhide answer", error);
            }
        };

        socketService?.socket?.on("hide post", handleHidePost);
        socketService?.socket?.on("unhide post", handleUnhidePost);

        return () => {
            socketService?.socket?.off("hide post", handleHidePost);
            socketService?.socket?.off("unhide post", handleUnhidePost);
        };
    }, []);

    // Socket updates
    useEffect(() => {
        PostUtils.socketIOPost(answers, setAnswers, profile);
    }, [answers, profile]);

    const renderQuestionContext = (questionContext) => {
        if (!questionContext) return null;

        const { post, imgId, imgVersion, videoId, videoVersion, gifUrl, _id: questionId } = questionContext;

        return (
            <div className="p-3 bg-transparent border-b border-gray-200 rounded-t-lg">
                {/* Question header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">Q</span>
                        </span>
                        <span>Answered:</span>
                    </div>
                    
                    {/* Move to question button */}
                    <button
                        onClick={() => navigateToQuestion(questionId)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        title="View full question"
                    >
                        <FaExternalLinkAlt size={10} />
                        <span>View question</span>
                    </button>
                </div>

                {/* Question text */}
                {post && (
                    <div className="mb-3">
                        <p className="font-medium text-gray-800 text-sm line-clamp-2">
                            {post}
                        </p>
                    </div>
                )}

                {/* Question media */}
                <div className="space-y-2">
                    {/* GIF */}
                    {gifUrl && (
                        <div className="rounded-lg overflow-hidden">
                            <img 
                                src={gifUrl} 
                                alt="Question GIF"
                                className="w-full max-h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => navigateToQuestion(questionId)}
                            />
                        </div>
                    )}

                    {/* Image */}
                    {imgId && imgVersion && (
                        <div className="rounded-lg overflow-hidden">
                            <img 
                                src={Utils.appImageUrl(imgVersion, imgId)}
                                alt="Question Image"
                                className="w-full max-h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => navigateToQuestion(questionId)}
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* Video */}
                    {videoId && videoVersion && (
                        <div className="rounded-lg overflow-hidden">
                            <video 
                                controls
                                className="w-full max-h-32 rounded"
                                src={Utils.appImageUrl(videoVersion, videoId)}
                                preload="metadata"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Loading skeleton */}
            {loading && !answers.length && (
                <div className="timeline-wrapper-container-main">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div key={index}>
                            <PostSkeleton />
                        </div>
                    ))}
                </div>
            )}

            {/* Answers list */}
            {!loading && answers.length > 0 && (
                <div className="size-full flex flex-col gap-2">
                    {answers.map((answer) => (
                        <div key={answer?._id} className="answer-item">
                            {(!Utils.checkIfUserIsBlocked(
                                profile?.blockedBy,
                                answer?.userId
                            ) || answer?.userId === profile?._id) && (
                                <>
                                    {PostUtils.checkPrivacy(
                                        answer,
                                        profile,
                                        following
                                    ) && (
                                        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                                            {/* Question context header với media */}
                                            {renderQuestionContext(answer.questionContext)}
                                            
                                            {/* Answer content */}
                                            <div className="p-1">
                                                <Post
                                                    post={answer}
                                                    showIcons={username === profile?.username}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}

                    {/* Load more button */}
                    {hasMoreAnswers && (
                        <div className="text-center py-4">
                            <button
                                onClick={loadMoreAnswers}
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Loading...' : 'Load More Answers'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Empty state */}
            {!loading && answers.length === 0 && (
                <div className="timeline-wrapper-container-main">
                    <div className="empty-page text-center py-12" data-testid="empty-answers">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-gray-400 text-2xl">💬</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No answers yet</h3>
                        <p className="text-gray-500">
                            {username === profile?.username 
                                ? "You haven't answered any questions yet" 
                                : `${username} hasn't answered any questions yet`
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

TimelineAnswers.propTypes = {
    loading: PropTypes.bool,
};

export default TimelineAnswers;