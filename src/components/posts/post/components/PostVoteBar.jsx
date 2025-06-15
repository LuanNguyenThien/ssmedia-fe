import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { postService } from "@services/api/post/post.service";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";
import { socketService } from "@services/socket/socket.service";
import { Utils } from "@services/utils/utils.service";
import { cloneDeep, filter, find } from "lodash";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";
import { FaSpinner } from "react-icons/fa";
import VoteList from "./VoteList";
import Counter from "./PostCount";

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

    const chevronUp = useMemo(() => {
        return (
            <DynamicSVG svgData={icons.chevron} className="size-6 md:size-8" />
        );
    }, []);

    const chevronDown = useMemo(() => {
        return (
            <DynamicSVG
                svgData={icons.chevron}
                className="size-6 md:size-8 rotate-180"
            />
        );
    }, []);

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
            console.time("part1");
            const reactionResponse =
                await postService.getSinglePostReactionByUsername(
                    post?._id,
                    profile?.username
                );
            const currentReactions = reactionResponse.data.reactions;
            const currentReactionType = currentReactions?.type;
            const hasReacted = !!Object.keys(currentReactions).length;

            const updatedPost = updatePostReactions(
                reaction,
                Object.keys(currentReactions).length,
                currentReactionType
            );

            const postReactions = addNewReaction(
                reaction,
                Object.keys(currentReactions).length,
                currentReactionType
            );
            const reactions = [...postReactions];

            const reactionsData = {
                userTo: post?.userId,
                postId: post?._id,
                type: reaction,
                postReactions: updatedPost.reactions,
                profilePicture: profile?.profilePicture,
                previousReaction: hasReacted ? currentReactionType : "",
            };
            dispatch(addReactions(reactions));
            sendSocketIOReactions(
                updatedPost,
                reaction,
                Object.keys(currentReactions).length,
                currentReactionType
            );

            if (!hasReacted) {
                await postService.addReaction(reactionsData);
                return;
            }
            if (reaction === currentReactionType) {
                postService.removeReaction(
                    post?._id,
                    currentReactionType,
                    updatedPost.reactions
                );
            } else {
                postService.addReaction(reactionsData);
            }
            console.timeEnd("part1");
        } catch (error) {
            // Optionally: show user feedback or log error
            console.error("Failed to update reaction:", error);
            // Optionally: dispatch error state or show toast
        }
    };

    const handleUpvote = async () => {
        console.time("handleUpvote");
        if (debounceRef.current.upvote) return;
        debounceRef.current.upvote = true;
        setUpvotePop(true);
        await addReactionPost("upvote");
        console.timeEnd("handleUpvote");
        setTimeout(() => {
            setUpvotePop(false);
            debounceRef.current.upvote = false;
        }, 300);
    };

    const handleDownvote = async () => {
        console.time("handleDownvote");
        if (debounceRef.current.downvote) return;
        debounceRef.current.downvote = true;
        setDownvotePop(true);
        await addReactionPost("downvote");
        console.timeEnd("handleDownvote");
        setTimeout(() => {
            setDownvotePop(false);
            debounceRef.current.downvote = false;
        }, 300);
    };

    const calculatePlaces = (value) => {
        if (value === 0) return [1];
        if (value < 10) return [1];
        if (value < 100) return [10, 1];
        if (value < 1000) return [100, 10, 1];
        if (value < 10000) return [1000, 100, 10, 1];
        return [10000, 1000, 100, 10, 1];
    };

    const upvoteCounterConfig = {
        fontSize: 14,
        padding: 2,
        places: calculatePlaces(post.reactions["upvote"]),
        gap: 1,
        borderRadius: 4,
        horizontalPadding: 6,
        textColor: "#1f2937",
        fontWeight: "bold",
        gradientHeight: 8,
        gradientFrom: "transparent",
        gradientTo: "transparent",
        containerStyle: {
            cursor: "pointer",
        },
        counterStyle: {
            minHeight: "18px",
            backgroundColor: "transparent",
        },
    };

    const downvoteCounterConfig = {
        ...upvoteCounterConfig,
        places: calculatePlaces(post.reactions["downvote"]),
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
            <div className="vote-bar flex flex-col items-center justify-center sm:justify-end gap-1 w-max md:w-14 h-full sm:py-2">
                {/* Upvote Button */}
                <button
                    title="Upvote this post"
                    aria-label="Upvote"
                    className={`flex items-center justify-center w-10 h-8 md:w-10 md:h-8 rounded transition-all duration-200 ease-linear focus:outline-none
                        ${
                            userSelectedReaction.toLowerCase() === "upvote"
                                ? "text-blue-300 "
                                : "text-gray-300 hover:scale-110 hover:text-blue-300"
                        }
                        ${upvotePop ? "scale-110" : ""}`}
                    onClick={handleUpvote}
                    type="button"
                >
                    <span className="sr-only">Upvote</span>
                    {chevronUp}
                </button>

                {/* Upvotes Count with Animation */}
                <div
                    onClick={() => {
                        getPostReactions();
                        setIsShowVoteList(!isShowVoteList);
                    }}
                    className="flex flex-row sm:flex-col items-center justify-center"
                >
                    <div
                        // onClick={() => {
                        //     setIsShowVoteList(!isShowVoteList);
                        // }}
                        // onMouseEnter={getPostReactions}
                        tabIndex={0}
                        role="button"
                        aria-label={`${post.reactions["upvote"]} upvotes - click to view details`}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setIsShowVoteList(!isShowVoteList);
                            }
                        }}
                        className="hover:scale-105 transition-transform duration-200 flex items-start"
                    >
                        <Counter
                            value={post.reactions["upvote"]}
                            {...upvoteCounterConfig}
                        />
                    </div>
                    {/* Horizontal Divider */}
                    <div className="w-3 h-[2px] bg-gray-300 my-4"></div>

                    {/* Downvotes Count with Animation */}
                    <div
                        // onMouseEnter={getPostReactions}
                        tabIndex={0}
                        role="button"
                        aria-label={`${post.reactions["downvote"]} downvotes - click to view details`}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setIsShowVoteList(!isShowVoteList);
                            }
                        }}
                        className="hover:scale-105 transition-transform duration-200 flex items-end "
                    >
                        <Counter
                            value={post.reactions["downvote"]}
                            {...downvoteCounterConfig}
                        />
                    </div>

                    {/* {postReactions.length > 0 && (
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
                    )} */}
                </div>

                {/* Downvote Button */}
                <button
                    title="Downvote this post"
                    aria-label="Downvote"
                    className={`flex items-center justify-center w-10 h-6 md:w-10 md:h-8 rounded transition-all duration-200 ease-linear focus:outline-none
            ${
                userSelectedReaction.toLowerCase() === "downvote"
                    ? "text-blue-300 "
                    : "text-gray-300 hover:scale-110 hover:text-blue-300"
            }
            ${downvotePop ? "scale-110" : ""}`}
                    onClick={handleDownvote}
                    type="button"
                >
                    <span className="sr-only">Downvote</span>
                    {chevronDown}
                </button>
            </div>
        </>
    );
};

PostVoteBar.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostVoteBar;
