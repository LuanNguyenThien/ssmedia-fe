import PropTypes from "prop-types";
import "@components/posts/comment-area/CommentArea.scss";
import {
    ChevronUp,
    ChevronDown,
    MessageSquare,
    Bookmark,
    Share2,
} from "lucide-react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";

import { useCallback, useEffect, useState } from "react";
import { cloneDeep, filter, find } from "lodash";
import { Utils } from "@services/utils/utils.service";
import { useDispatch, useSelector } from "react-redux";
import { postService } from "@services/api/post/post.service";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";
import { socketService } from "@services/socket/socket.service";
import useLocalStorage from "@hooks/useLocalStorage";
import { clearPost, updatePostItem } from "@redux/reducers/post/post.reducer";
import useEffectOnce from "@hooks/useEffectOnce";

const CommentArea = ({ post, onlyActions = false }) => {
    const { profile } = useSelector((state) => state.user);
    let { reactions } = useSelector((state) => state.userPostReactions);
    const [userSelectedReaction, setUserSelectedReaction] = useState("like");
    const selectedPostId = useLocalStorage("selectedPostId", "get");
    const [setSelectedPostId] = useLocalStorage("selectedPostId", "set");
    const [isFavorite, setIsFavorite] = useState(false);
    const dispatch = useDispatch();
    const [upvotePop, setUpvotePop] = useState(false);
    const [downvotePop, setDownvotePop] = useState(false);

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

    useEffectOnce(() => {
        const checkFavoriteStatus = async () => {
            try {
                if (post.savedBy === undefined) setIsFavorite(false);
                else setIsFavorite(post.savedBy.includes(profile?._id));
            } catch (error) {
                Utils.dispatchNotification(
                    error?.response?.data?.message,
                    "error",
                    dispatch
                );
            }
        };

        checkFavoriteStatus();
    });

    const toggleCommentInput = () => {
        if (!selectedPostId) {
            setSelectedPostId(post?._id);
            dispatch(updatePostItem(post));
        } else {
            removeSelectedPostId();
        }
    };

    const removeSelectedPostId = () => {
        if (selectedPostId === post?._id) {
            setSelectedPostId("");
            dispatch(clearPost());
        } else {
            setSelectedPostId(post?._id);
            dispatch(updatePostItem(post));
        }
    };

    const addFavoritePost = async () => {
        try {
            const favPostData = {
                userId: profile?._id,
                postId: post?._id,
            };
            if (isFavorite) {
                setIsFavorite(false);
            } else {
                setIsFavorite(true);
            }
            const response = await postService.addfavPost(favPostData);
            Utils.dispatchNotification(
                response.data.message,
                "success",
                dispatch
            );
        } catch (error) {
            Utils.dispatchNotification(
                error?.response?.data?.message,
                "error",
                dispatch
            );
        }
    };

    const addReactionPost = async (reaction) => {
        try {
            const reactionResponse =
                await postService.getSinglePostReactionByUsername(
                    post?._id,
                    profile?.username
                );
            post = updatePostReactions(
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
                post,
                reaction,
                Object.keys(reactionResponse.data.reactions).length,
                reactionResponse.data.reactions?.type
            );

            const reactionsData = {
                userTo: post?.userId,
                postId: post?._id,
                type: reaction,
                postReactions: post.reactions,
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
                        post.reactions
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

    const updatePostReactions = (
        newReaction,
        hasResponse,
        previousReaction
    ) => {
        post = cloneDeep(post);
        if (!hasResponse) {
            post.reactions[newReaction] += 1;
        } else {
            if (post.reactions[previousReaction] > 0) {
                post.reactions[previousReaction] -= 1;
            }
            if (previousReaction !== newReaction) {
                post.reactions[newReaction] += 1;
            }
        }
        return post;
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

    const handleUpvote = () => {
        setUpvotePop(true);
        addReactionPost("upvote");
        setTimeout(() => setUpvotePop(false), 250);
    };

    const handleDownvote = () => {
        setDownvotePop(true);
        addReactionPost("downvote");
        setTimeout(() => setDownvotePop(false), 250);
    };

    useEffect(() => {
        selectedUserReaction(reactions);
    }, [selectedUserReaction, reactions]);

    return (
        <div className="flex items-center justify-between w-full max-w-full py-2 bg-white rounded-lg ">
            {/* Render only action buttons if onlyActions is true */}
            {!onlyActions && (
                <div className="flex items-center rounded-full overflow-hidden">
                    {/* Upvote button */}
                    <button
                        aria-label="Upvote"
                        className={`flex items-center gap-1 px-3 h-9 rounded-full focus:outline-none border border-gray-200 transition-colors transition-transform duration-200
                            ${
                                userSelectedReaction.toLowerCase() === "upvote"
                                    ? "text-green-600 bg-green-50"
                                    : "text-gray-700 hover:bg-gray-100"
                            }
                            ${upvotePop ? "scale-110" : ""}`}
                        onClick={handleUpvote}
                        type="button"
                    >
                        <ChevronUp className="size-7" />
                        <span className="font-medium hidden sm:block">Upvote</span>
                    </button>
                    {/* Centered vote count with border on both sides */}
                    <span className="mx-0 min-w-[40px] text-center font-medium text-gray-500 select-none  border-gray-200">
                        {post.reactions["upvote"] - post.reactions["downvote"]}
                    </span>
                    {/* Downvote button */}
                    <button
                        aria-label="Downvote"
                        className={`flex items-center gap-1 px-3 h-9 rounded-full focus:outline-none border transition-colors transition-transform duration-200
                            ${
                                userSelectedReaction.toLowerCase() === "downvote"
                                    ? "text-red-600 bg-red-50"
                                    : "text-gray-400 hover:bg-gray-100"
                            }
                            ${downvotePop ? "scale-110" : ""}`}
                        onClick={handleDownvote}
                        type="button"
                    >
                        <ChevronDown className="size-7" />
                        <span className="font-medium hidden sm:block">
                            Downvote
                        </span>
                    </button>
                </div>
            )}
            {/* Action Buttons Group */}
            <div className="flex items-center gap-2">
                {/* Comment Button */}
                <button
                    aria-label="Comment"
                    className="flex items-center gap-2 px-4 h-9 text-gray-700 bg-gray-50 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    onClick={toggleCommentInput}
                    type="button"
                >
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium hidden sm:block">Comment</span>
                </button>

                {/* Favorite Button */}
                <button
                    aria-label={isFavorite ? "Unsave post" : "Save post"}
                    className={`flex items-center gap-2 px-4 h-9 rounded-full bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition
                        ${isFavorite ? "ring-2 ring-blue-200" : ""}`}
                    onClick={addFavoritePost}
                    type="button"
                >
                    {isFavorite ? (
                        <FaBookmark
                            className={`w-5 h-5 transition-colors duration-150 ${
                                isFavorite ? "text-blue-600" : "text-gray-500"
                            }`}
                        />
                    ) : (
                        <FaRegBookmark
                            className={`w-5 h-5 transition-colors duration-150 ${
                                isFavorite ? "text-blue-600" : "text-gray-500"
                            }`}
                        />
                    )}
                    <span
                        className={`font-medium hidden sm:block ${
                            isFavorite ? "text-blue-700" : "text-gray-700"
                        }`}
                    >
                        {isFavorite ? "Saved" : "Save"}
                    </span>
                </button>

                {/* Share Button */}
                {/* <button
                    aria-label="Share"
                    className="flex items-center gap-2 px-4 h-9 text-gray-700 bg-gray-50 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    type="button"
                >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium hidden sm:block">Share</span>
                </button> */}
            </div>
        </div>
    );
};

CommentArea.propTypes = {
    post: PropTypes.object,
    onlyActions: PropTypes.bool,
};

export default CommentArea;
