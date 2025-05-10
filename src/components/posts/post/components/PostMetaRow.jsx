import PropTypes from "prop-types";
import Avatar from "@components/avatar/Avatar";
import { timeAgo } from "@services/utils/timeago.utils";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import useLocalStorage from "@/hooks/useLocalStorage";
import { updatePostItem } from "@redux/reducers/post/post.reducer";
import { toggleCommentsModal } from "@redux/reducers/modal/modal.reducer";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";
const PostMetaRow = ({ post }) => {
    const { profile } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { commentsModalIsOpen } = useSelector((state) => state.modal);
    const [isFavorite, setIsFavorite] = useState(false);
    const [setSelectedPostCommentId] = useLocalStorage(
        "selectedPostCommentId",
        "set"
    );
    console.log(post);
    useEffect(() => {
        if (post.savedBy === undefined) setIsFavorite(false);
        else setIsFavorite(post.savedBy.includes(profile?._id));
    }, [post, profile?._id]);
    const openCommentsComponent = () => {
        setSelectedPostCommentId(post._id);
        dispatch(updatePostItem(post));
        dispatch(toggleCommentsModal(!commentsModalIsOpen));
    };
    const addFavoritePost = async () => {
        try {
            const favPostData = {
                userId: profile?._id,
                postId: post?._id,
            };
            setIsFavorite((prev) => !prev);
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

    return (
        <div className="post-meta-row flex items-center justify-between w-full mt-4 border-t border-gray-200 pt-2">
            <div className="flex items-center gap-2 min-w-0">
                <Avatar
                    name={post?.username}
                    bgColor={post?.avatarColor}
                    textColor="#ffffff"
                    size={28}
                    avatarSrc={post?.profilePicture}
                />
                <span className="text-xs text-gray-400">Posted by</span>
                <div className="text-xs font-medium text-blue-600 truncate">
                    {post?.username}
                </div>
                <span className="text-xs text-gray-400">
                    {timeAgo.transform(post?.createdAt)}
                </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-500 cursor-pointer">
                <div
                    className="flex items-center gap-1"
                    onClick={openCommentsComponent}
                >
                    <DynamicSVG svgData={icons.comment} className="size-5" />

                    <span className="font-medium">{post?.commentsCount}</span>
                </div>
                {/* Divider */}
                <span className="mx-2 h-4 border-r border-gray-200" />
                {/* Favorite Button */}
                <button
                    aria-label={isFavorite ? "Unsave post" : "Save post"}
                    className={`flex items-center gap-1 px-2 h-7 rounded-full  hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition
           `}
                    onClick={addFavoritePost}
                    type="button"
                >
                    {isFavorite ? (
                        <FaBookmark
                            className={`w-4 h-4 transition-colors duration-150 ${
                                isFavorite ? "text-blue-600" : "text-gray-400"
                            }`}
                        />
                    ) : (
                        <FaRegBookmark
                            className={`w-4 h-4 transition-colors duration-150 ${
                                isFavorite ? "text-blue-600" : "text-gray-400"
                            }`}
                        />
                    )}
                    <span
                        className={`font-medium ${
                            isFavorite ? "text-blue-700" : "text-gray-400 "
                        }`}
                    >
                        {isFavorite ? "Saved" : "Save"}
                    </span>
                </button>
            </div>
        </div>
    );
};

PostMetaRow.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostMetaRow;
