import PropTypes from "prop-types";
import {
  FaRegCommentAlt,
  FaBookmark,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "@components/posts/comment-area/CommentArea.scss";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Bookmark,
  Share2,
} from "lucide-react";
import Reactions from "@components/posts/reactions/Reactions";
import { useCallback, useEffect, useState } from "react";
import { cloneDeep, filter, find } from "lodash";
import { Utils } from "@services/utils/utils.service";
import { reactionsMap } from "@services/utils/static.data";
import { useDispatch, useSelector } from "react-redux";
import { postService } from "@services/api/post/post.service";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";
import { socketService } from "@services/socket/socket.service";
import useLocalStorage from "@hooks/useLocalStorage";
import { clearPost, updatePostItem } from "@redux/reducers/post/post.reducer";
import useEffectOnce from "@hooks/useEffectOnce";

const CommentArea = ({ post }) => {
  const { profile } = useSelector((state) => state.user);
  let { reactions } = useSelector((state) => state.userPostReactions);
  const [userSelectedReaction, setUserSelectedReaction] = useState("like");
  const selectedPostId = useLocalStorage("selectedPostId", "get");
  const [setSelectedPostId] = useLocalStorage("selectedPostId", "set");
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();

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
      Utils.dispatchNotification(response.data.message, "success", dispatch);
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
        previousReaction: Object.keys(reactionResponse.data.reactions).length
          ? reactionResponse.data.reactions?.type
          : "",
      };

      if (!Object.keys(reactionResponse.data.reactions).length) {
        await postService.addReaction(reactionsData);
      } else {
        reactionsData.previousReaction = reactionResponse.data.reactions?.type;
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

  const updatePostReactions = (newReaction, hasResponse, previousReaction) => {
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

  useEffect(() => {
    selectedUserReaction(reactions);
    console.log(post.reactions['upvote']);
  }, [selectedUserReaction, reactions]);

  return (
    <div className="flex items-center justify-between w-full max-w-3xl py-3 ">
      <div className="flex items-center">
        {/* Upvote button */}
        <button
          className={`flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-l-full border border-gray-200 ${
            userSelectedReaction.toLowerCase() === "upvote"
              ? "text-green-500"
              : "text-gray-700"
          }`}
          onClick={() => addReactionPost("upvote")}
        >
          <FaArrowUp className="w-5 h-5" />
          <span className="font-medium">Upvote</span>
          <span className="text-gray-500 mx-0.5">·</span>
          <span
            className='${
            userSelectedReaction.toLowerCase() === "upvote"
              ? "text-green-500"
              : "text-gray-700"
          }'
          >
            {post.reactions["upvote"]}
          </span>
        </button>

        {/* Downvote button */}
        <button
          className={`flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-9 h-9 rounded-r-full border border-gray-200 border-l-0 ${
            userSelectedReaction.toLowerCase() === "downvote"
              ? "text-red-500"
              : "text-gray-400"
          }`}
          onClick={() => addReactionPost("downvote")}
        >
          <FaArrowDown className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
          onClick={toggleCommentInput}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium hidden sm:block">Comment</span>
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          onClick={addFavoritePost}
        >
          <FaBookmark
            className={`favorite-icon text-${
              isFavorite ? "blue-600" : "gray-500"
            }`}
          />
          <span
            className={`font-medium hidden sm:block text-${
              isFavorite ? "blue-700" : "gray-700"
            }`}
          >
            {isFavorite ? "Saved" : "Save"}
          </span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
          <Share2 className="w-5 h-5" />
          <span className="font-medium hidden sm:block">Share</span>
        </button>
      </div>
      {/* <div className="comment-block" onClick={toggleCommentInput}>
        <span className="comments-text">
          <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
        </span>
      </div>
      <div className="favorite-block" onClick={addFavoritePost}>
        <span className="favorite-text">
          <FaBookmark
            className={`favorite-icon ${isFavorite ? "favorite-active" : ""}`}
          />
        </span>
      </div> */}
    </div>
  );
};

CommentArea.propTypes = {
  post: PropTypes.object,
};

export default CommentArea;
