import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Avatar from "@components/avatar/Avatar";
import { timeAgo } from "@services/utils/timeago.utils";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { FaEdit, FaFlag, FaTrash } from "react-icons/fa";
import useLocalStorage from "@/hooks/useLocalStorage";
import { updatePostItem } from "@redux/reducers/post/post.reducer";
import {
    toggleCommentsModal,
    openModal,
    toggleDeleteDialog,
} from "@redux/reducers/modal/modal.reducer";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";
import { icons, postPrivacy } from "@/assets/assets";
import { ProfileUtils } from "@/services/utils/profile-utils.service";
import ReportModal from "@/components/modal/ReportModal";

const PostMetaRow = ({ post }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.user);
    const { commentsModalIsOpen } = useSelector((state) => state.modal);

    const dropdownRef = useRef(null);
    const [setSelectedPostCommentId] = useLocalStorage(
        "selectedPostCommentId",
        "set"
    );

    const [isFavorite, setIsFavorite] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const isPostOwner = profile?._id === post?.userId;

    useEffect(() => {
        if (post.savedBy === undefined) setIsFavorite(false);
        else setIsFavorite(post.savedBy.includes(profile?._id));
    }, [post, profile?._id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const handleEditPost = () => {
        dispatch(updatePostItem(post));
        dispatch(openModal({ type: "edit" }));
        setIsDropdownOpen(false);
    };

    const handleDeletePost = () => {
        dispatch(
            toggleDeleteDialog({ toggle: true, data: post, dialogType: "post" })
        );
        setIsDropdownOpen(false);
    };

    const handleReportPost = async (values) => {
        const reportData = {
            postId: post?._id,
            content: values.reason,
            details: values.reasonDescription,
        };
        try {
            const response = await postService.reportPost(reportData);
            Utils.dispatchNotification(
                response.data.message,
                "success",
                dispatch
            );
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error reporting post",
                "error",
                dispatch
            );
        } finally {
            setIsReportModalOpen(false);
            setIsDropdownOpen(false);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const generatePrivacy = (privacy) => {
        switch (privacy) {
            case "Public":
                return (
                    <div className="group relative">
                        <img
                            src={postPrivacy.publicIcon}
                            className="size-3"
                            alt="Public"
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Public
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                );
            case "Private":
                return (
                    <div className="group relative">
                        <img
                            src={postPrivacy.privateIcon}
                            className="size-3"
                            alt="Private"
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Private
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                );
            case "Followers":
                return (
                    <div className="group relative">
                        <img
                            src={postPrivacy.followersIcon}
                            className="size-3"
                            alt="Followers"
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Followers
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                );
        }
    };
    return (
        <>
            {isReportModalOpen && (
                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    onSubmit={handleReportPost}
                />
            )}
            <div
                className={`post-meta-row flex items-center justify-between w-full mt-1  border-t border-gray-200 pt-2 ${
                    post?.htmlPost ? "sm:mt-4" : "sm:mt-2"
                }`}
            >
                <div className="flex items-center gap-4 sm:gap-2 min-w-0">
                    <Avatar
                        name={post?.username}
                        bgColor={post?.avatarColor}
                        textColor="#ffffff"
                        size={28}
                        avatarSrc={post?.profilePicture}
                    />
                    <div className="flex flex-col gap-1 sm:gap-2 sm:flex-row">
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">
                                Posted by
                            </span>
                            <div
                                onClick={() => {
                                    ProfileUtils.navigateToProfile(
                                        {
                                            username: post?.username,
                                            _id: post?.userId,
                                        },
                                        navigate
                                    );
                                }}
                                className="text-xs font-medium text-blue-600 truncate hover:underline cursor-pointer"
                            >
                                {post?.username}
                            </div>
                        </div>

                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            {generatePrivacy(post?.privacy)}
                            <span className="mx-2 h-4 border-r border-gray-200" />
                            {timeAgo.transform(post?.createdAt)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-500 cursor-pointer">
                    <div
                        className="flex items-center gap-1"
                        onClick={openCommentsComponent}
                    >
                        <DynamicSVG
                            svgData={icons.comment}
                            className="size-5"
                        />
                        <span className="font-medium">
                            {post?.commentsCount}
                        </span>
                    </div>
                    {/* Divider */}
                    <span className="mx-2 h-4 border-r border-gray-200" />
                    {/* Favorite*/}
                    <button
                        aria-label={isFavorite ? "Unsave post" : "Save post"}
                        className={`flex items-center gap-1 px-2 h-7 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                        onClick={addFavoritePost}
                        type="button"
                    >
                        {isFavorite ? (
                            <FaBookmark
                                className={`w-4 h-4 transition-colors duration-150 ${
                                    isFavorite
                                        ? "text-blue-600"
                                        : "text-gray-400"
                                }`}
                            />
                        ) : (
                            <FaRegBookmark
                                className={`w-4 h-4 transition-colors duration-150 ${
                                    isFavorite
                                        ? "text-blue-600"
                                        : "text-gray-400"
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

                    <div className="relative" ref={dropdownRef}>
                        <button
                            aria-label="Post options"
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-50 transition-colors"
                            onClick={toggleDropdown}
                            type="button"
                        >
                            <DynamicSVG
                                svgData={icons.options}
                                className="size-5"
                            />
                            {/* <FaEllipsisV className="w-4 h-4 text-gray-500" /> */}
                        </button>

                        <div 
                            className={`
                              absolute right-0 bottom-0 mt-2 w-max 
                              bg-white border border-gray-200 rounded-lg shadow-lg z-10 
                              transform transition-all duration-200 ease-in-out
                              ${isDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}
                              font-medium
                            `}
                            style={{
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                          >
                            <div className="py-2">
                              <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide font-semibold border-b border-gray-100">
                                Actions
                              </div>
                              {!isPostOwner && (
                                <button
                                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200 group focus:outline-none focus:bg-red-500 focus:text-white"
                                  onClick={() => setIsReportModalOpen(true)}
                                >
                                  <div className="flex items-center justify-center bg-gray-200 group-hover:bg-white group-focus:bg-white rounded-full p-2 transition-colors duration-200">
                                    <FaFlag className="size-4 text-red-500 group-hover:text-red-500 group-focus:text-red-500" />
                                  </div>
                                  <span className="font-medium">Report post</span>
                                </button>
                              )}
                              {isPostOwner && (
                                <>
                                  <button
                                    className="flex items-center gap-1 w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-primary hover:text-white transition-all duration-200 group focus:outline-none focus:bg-primary focus:text-white"
                                    onClick={handleEditPost}
                                  >
                                    <div className="flex items-center justify-center bg-gray-200 group-hover:bg-white group-focus:bg-white rounded-full p-2 transition-colors duration-200">
                                      <FaEdit className="size-4 text-primary group-hover:text-primary group-focus:text-primary" />
                                    </div>
                                    <span className="font-medium">Edit post</span>
                                  </button>
                                  <button
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200 group focus:outline-none focus:bg-red-500 focus:text-white"
                                    onClick={handleDeletePost}
                                  >
                                    <div className="flex items-center justify-center bg-gray-200 group-hover:bg-white group-focus:bg-white rounded-full p-2 transition-colors duration-200">
                                      <FaTrash className="size-4 text-red-500 group-hover:text-red-500 group-focus:text-red-500" />
                                    </div>
                                    <span className="font-medium">Delete post</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                    </div>
                </div>
            </div>
        </>
    );
};

PostMetaRow.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostMetaRow;
