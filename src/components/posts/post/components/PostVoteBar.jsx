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

const PostVoteBar = ({ post }) => {
    const { profile } = useSelector((state) => state.user);
    let { reactions } = useSelector((state) => state.userPostReactions);
    const dispatch = useDispatch();
    const [userSelectedReaction, setUserSelectedReaction] = useState("like");
    const [upvotePop, setUpvotePop] = useState(false);
    const [downvotePop, setDownvotePop] = useState(false);
    const debounceRef = useRef({ upvote: false, downvote: false });
   
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
        <div className="vote-bar flex flex-row md:flex-col items-center gap-1 md:w-14">
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
                <DynamicSVG svgData={icons.chevron} className="size-5 md:size-6" />
            </button>
            <span className="text-center font-medium text-primary-black select-none text-sm md:text-lg md:my-1">
                {post.reactions["upvote"] - post.reactions["downvote"]}
            </span>
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
        </div>
    );
};

PostVoteBar.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostVoteBar;
