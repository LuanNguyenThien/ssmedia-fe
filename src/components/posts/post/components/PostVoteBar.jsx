import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect, useRef } from "react";
import { postService } from "@services/api/post/post.service";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";
import { socketService } from "@services/socket/socket.service";
import { Utils } from "@services/utils/utils.service";
import { cloneDeep, filter, find } from "lodash";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";
import { FaSpinner } from "react-icons/fa";
import { openModal } from "@redux/reducers/modal/modal.reducer";
import VoteList from "./VoteList";

const PostVoteBar = ({ post }) => {
    const { profile } = useSelector((state) => state.user);
    let { reactions } = useSelector((state) => state.userPostReactions);
    const dispatch = useDispatch();
    const [userSelectedReaction, setUserSelectedReaction] = useState("like");
    const [upvotePop, setUpvotePop] = useState(false);
    const [downvotePop, setDownvotePop] = useState(false);
    const debounceRef = useRef({ upvote: false, downvote: false });
    const [postReactions, setPostReactions] = useState([]);
    const [isShowVoteList, setIsShowVoteList] = useState(false);
    const [answerCount, setAnswerCount] = useState(post.answerCount || 0);

    const openAnswerForm = () => {
        dispatch(openModal({
            type: 'add',
            data: {
                questionId: post._id,
                question: post.post,
                questionUserId: post.userId,
                username: post.username
            },
            modalType: 'createpost',
        }));
    };

    const navigateToQuestionDetail = () => {
        navigate(`/app/social/question/${post._id}`);
    };

    const getAnswerCount = useCallback(async () => {
        if (!post.htmlPost) { // Chỉ lấy answer count cho questions
            try {
                const response = await postService.getAnswersCount(post._id);
                setAnswerCount(response.data.count);
            } catch (error) {
                console.error('Error fetching answer count:', error);
            }
        }
    }, [post._id, post.htmlPost]);

     useEffect(() => {
        if (!post.htmlPost) { // Chỉ lấy số lượng câu trả lời cho questions
            getAnswerCount();
        }
    }, [getAnswerCount, post.htmlPost]);

    const getPostReactions = async () => {
        try {
            const response = await postService.getPostReactions(post?._id);
            setPostReactions(response.data.reactions);
        } catch (error) {
            Utils.dispatchNotification(
                error?.response?.data?.message,
                "error",
                dispatch
            );
        }
    };

    const selectedUserReaction = useCallback(
        (postReactions) => {
            const userReaction = find(
                postReactions,
                (reaction) => reaction.postId === post._id
            );
            const result = userReaction
                ? Utils.firstLetterUpperCase(userReaction.type)
                : "Like";
            setUserSelectedReaction(result);
        },
        [post]
    );

    useEffect(() => {
        selectedUserReaction(reactions);
    }, [selectedUserReaction, reactions]);

    const updatePostReactions = (
        newReaction,
        hasResponse,
        previousReaction
    ) => {
        const updatedPost = cloneDeep(post);
        if (!hasResponse) {
            updatedPost.reactions[newReaction] += 1;
        } else {
            if (updatedPost.reactions[previousReaction] > 0) {
                updatedPost.reactions[previousReaction] -= 1;
            }
            if (previousReaction !== newReaction) {
                updatedPost.reactions[newReaction] += 1;
            }
        }
        return updatedPost;
    };

    const addNewReaction = (newReaction, hasResponse, previousReaction) => {
        const postReactions = filter(
            reactions,
            (reaction) => reaction?.postId !== post?._id
        );
        const newPostReaction = {
            avatarColor: profile?.avatarColor,
            createdAt: `${new Date()}`,
            postId: post?._id,
            profilePicture: profile?.profilePicture,
            username: profile?.username,
            type: newReaction,
        };
        if (hasResponse && previousReaction !== newReaction) {
            postReactions.push(newPostReaction);
        } else if (!hasResponse) {
            postReactions.push(newPostReaction);
        }
        return postReactions;
    };

    const sendSocketIOReactions = (
        post,
        reaction,
        hasResponse,
        previousReaction
    ) => {
        const socketReactionData = {
            userTo: post.userId,
            postId: post._id,
            username: profile?.username,
            avatarColor: profile?.avatarColor,
            type: reaction,
            postReactions: post.reactions,
            profilePicture: profile?.profilePicture,
            previousReaction: hasResponse ? previousReaction : "",
        };
        socketService?.socket?.emit("reaction", socketReactionData);
    };

    const addReactionPost = async (reaction) => {
        try {
            const reactionResponse =
                await postService.getSinglePostReactionByUsername(
                    post?._id,
                    profile?.username
                );

            const updatedPost = updatePostReactions(
                reaction,
                Object.keys(reactionResponse.data.reactions).length,
                reactionResponse.data.reactions?.type
            );
            const postReactions = addNewReaction(
                reaction,
                Object.keys(reactionResponse.data.reactions).length,
                reactionResponse.data.reactions?.type
            );
            reactions = [...postReactions];
            dispatch(addReactions(reactions));
            sendSocketIOReactions(
                updatedPost,
                reaction,
                Object.keys(reactionResponse.data.reactions).length,
                reactionResponse.data.reactions?.type
            );
            const reactionsData = {
                userTo: post?.userId,
                postId: post?._id,
                type: reaction,
                postReactions: updatedPost.reactions,
                profilePicture: profile?.profilePicture,
                previousReaction: Object.keys(reactionResponse.data.reactions)
                    .length
                    ? reactionResponse.data.reactions?.type
                    : "",
            };
            if (!Object.keys(reactionResponse.data.reactions).length) {
                await postService.addReaction(reactionsData);
            } else {
                reactionsData.previousReaction =
                    reactionResponse.data.reactions?.type;
                if (reaction === reactionsData.previousReaction) {
                    await postService.removeReaction(
                        post?._id,
                        reactionsData.previousReaction,
                        updatedPost.reactions
                    );
                } else {
                    await postService.addReaction(reactionsData);
                }
            }
        } catch (error) {
            Utils.dispatchNotification(
                error?.response?.data?.message,
                "error",
                dispatch
            );
        }
    };

    const handleUpvote = () => {
        if (debounceRef.current.upvote) return;
        debounceRef.current.upvote = true;
        setUpvotePop(true);
        addReactionPost("upvote");
        setTimeout(() => {
            setUpvotePop(false);
            debounceRef.current.upvote = false;
        }, 500);
    };

    const handleDownvote = () => {
        if (debounceRef.current.downvote) return;
        debounceRef.current.downvote = true;
        setDownvotePop(true);
        addReactionPost("downvote");
        setTimeout(() => {
            setDownvotePop(false);
            debounceRef.current.downvote = false;
        }, 500);
    };

    return (
        <>
            {isShowVoteList && postReactions && (
                <VoteList
                    list={postReactions}
                    maxHeight={400}
                    onClose={() => setIsShowVoteList(false)}
                />
            )}
            <div className="vote-bar flex flex-row md:flex-col md:justify-end items-center gap-1 md:w-14 h-full">
                <button
                    aria-label="Upvote"
                    className={`flex flex-col transition-all duration-200 ease-linear items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full focus:outline-none
            ${
                userSelectedReaction.toLowerCase() === "upvote"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:scale-110 hover:text-green-500"
            }
            ${upvotePop ? "scale-110" : ""}`}
                    onClick={handleUpvote}
                    type="button"
                >
                    <span className="sr-only">Upvote</span>
                    <DynamicSVG
                        svgData={icons.chevron}
                        className="size-5 md:size-6"
                    />
                </button>
                {/* show upvote and downvote point */}
                <div className="relative group">
                    <span
                        onClick={() => {
                            setIsShowVoteList(!isShowVoteList);
                        }}
                        onMouseEnter={getPostReactions}
                        className="text-center font-medium text-primary-black select-none text-sm md:text-lg md:my-1 cursor-pointer hover:underline block"
                    >
                        {post.reactions["upvote"] - post.reactions["downvote"]}
                    </span>
                    {postReactions.length > 0 && (
                        <div
                            className="invisible group-hover:visible absolute w-[200px] bg-[var(--gray-15)] rounded-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-600 p-[5px_8px] top-[115%] left-1/2 -translate-x-[45px]"
                            data-testid="tooltip-container"
                        >
                            <div className="float-left max-h-[500px] mb-0 w-auto h-auto">
                                {postReactions.length === 0 && (
                                    <FaSpinner className="ml-[85px] text-[var(--white-1)] animate-spin" />
                                )}
                                {postReactions.length > 0 && (
                                    <>
                                        {postReactions
                                            .slice(0, 19)
                                            .map((reaction) => (
                                                <span
                                                    key={Utils.generateString(
                                                        10
                                                    )}
                                                    className="text-[0.75rem] font-normal block text-[var(--white-1)]"
                                                >
                                                    {reaction?.username}
                                                </span>
                                            ))}
                                        {postReactions.length > 20 && (
                                            <span className="text-[0.75rem] font-normal block text-[var(--white-1)]">
                                                and {postReactions.length - 20}{" "}
                                                others...
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    aria-label="Downvote"
                    className={`flex flex-col items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full focus:outline-none transition-all duration-200 ease-linear
            ${
                userSelectedReaction.toLowerCase() === "downvote"
                    ? "text-red-600 bg-red-50"
                    : "text-gray-400 hover:scale-110 hover:text-red-500"
            }
            ${downvotePop ? "scale-110" : ""}`}
                    onClick={handleDownvote}
                    type="button"
                >
                    <span className="sr-only">Downvote</span>
                    <DynamicSVG
                        svgData={icons.chevron}
                        className="size-5 md:size-6 rotate-180"
                    />
                </button>

                {!post.htmlPost && (
                    <>
                        {/* Nút Answer */}
                        <button
                            aria-label="Answer"
                            className="mt-2 flex flex-col items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full focus:outline-none transition-all duration-200 ease-linear text-primary hover:bg-primary-light hover:text-primary-dark"
                            onClick={openAnswerForm}
                            type="button"
                        >
                            <span className="">Answer</span>
                        </button>
                        
                        {/* Số lượng answers và link */}
                        {answerCount > 0 && (
                            <div 
                                className="mt-1 text-xs md:text-sm text-center font-medium text-primary cursor-pointer hover:underline"
                                onClick={navigateToQuestionDetail}
                            >
                                {answerCount} {answerCount === 1 ? 'answer' : 'answers'}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

PostVoteBar.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostVoteBar;
