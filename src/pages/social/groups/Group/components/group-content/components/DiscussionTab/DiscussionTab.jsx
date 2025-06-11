import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaLock } from "react-icons/fa";
import { uniqBy } from "lodash";
import PostForm from "@components/posts/post-form/PostFormGroup";
import Posts from "@components/posts/PostGroup";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import { PostUtils } from "@services/utils/post-utils.service";
import { socketService } from "@services/socket/socket.service";
import { followerService } from "@services/api/followers/follower.service";
import Spinner from "@components/spinner/Spinner";
import { useParams } from "react-router-dom";
import DiscussionTabSkeleton from "./DiscussionTabSkeleton";
import DiscussionTabBlock from "./DiscussionTabBlock";

export default function DiscussionTab({ group, canViewContent, onJoinGroup }) {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.user);
    const { groupId } = useParams();
    const socket = socketService?.socket;

    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const bodyRef = useRef(null);
    const bottomLineRef = useRef();
    const appPosts = useRef([]);
    const PAGE_SIZE = 10;

    useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);

    function fetchPostData() {
        if (loadingMore) {
            return;
        }
        console.log("fetching group posts");
        setLoadingMore(true);
        getAllGroupPosts().finally(() => setLoadingMore(false));
    }

    const getAllGroupPosts = async () => {
        try {
            // In real implementation, this would be a group-specific endpoint
            // For now, we'll use the general posts endpoint but filter for group
            const response = await postService.getAllPostsGroup(
                groupId,
                currentPage
            );
            if (response.data.posts && response.data.posts.length > 0) {
                appPosts.current = [...posts, ...response.data.posts];
                const allPosts = uniqBy(appPosts.current, "_id");
                setPosts(allPosts);
                setCurrentPage((prevPage) => prevPage + 1);

                if (response.data.totalPosts) {
                    setTotalPostsCount(
                        Math.floor(response.data.totalPosts / 2)
                    ); // Mock group posts count
                }

                return true;
            } else {
                return false;
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to load group posts.",
                "error",
                dispatch
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getUserFollowing = async () => {
        try {
            const response = await followerService.getUserFollowing();
            setFollowing(response.data.following);
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to load following.",
                "error",
                dispatch
            );
        }
    };

    useEffect(() => {
        if (canViewContent) {
            getUserFollowing();
            getAllGroupPosts();
        }
    }, [canViewContent, group.id]);

    useEffect(() => {
        const handleHidePost = ({ postId }) => {
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== postId)
            );
        };

        const handleUnhidePost = async ({ postId }) => {
            try {
                const response = await postService.getPost(postId);
                const newPost = response.data.post;

                setPosts((prevPosts) => {
                    const exists = prevPosts.find((p) => p._id === newPost._id);
                    if (exists) return prevPosts;
                    return [newPost, ...prevPosts];
                });
            } catch (error) {
                console.error("Failed to unhide post", error);
            }
        };

        socket?.on("hide post", handleHidePost);
        socket?.on("unhide post", handleUnhidePost);

        return () => {
            socket?.off("hide post", handleHidePost);
            socket?.off("unhide post", handleUnhidePost);
        };
    }, [socket]);

    useEffect(() => {
        PostUtils.socketIOPost(posts, setPosts, profile);
    }, [posts, profile]);

    // if user is not a member of the group, show the block
    if (!canViewContent) {
        return <DiscussionTabBlock onJoinGroup={onJoinGroup} />;
    }

    // if loading and no posts, show the skeleton
    if (loading && posts.length === 0) {
        return <DiscussionTabSkeleton />;
    }

    return (
        <div className="w-full max-w-full">
            <div className="flex flex-col space-y-1 sm:space-y-1" ref={bodyRef}>
                {/* Post Form - Enhanced styling */}
                <div className="w-full">
                    <PostForm groupId={group.id} />
                </div>

                {/* Posts List Container */}
                <div className="w-full">
                    <Posts
                        type="discussion"
                        allPosts={posts}
                        postsLoading={loading}
                        userFollowing={following}
                        groupContext={group}
                    />
                </div>

                {/* End of posts message - Enhanced styling */}
                {currentPage > Math.ceil(totalPostsCount / PAGE_SIZE) &&
                    posts.length > 0 && (
                        <div className="w-full bg-white rounded-xl shadow-sm p-6 text-center border border-gray-50">
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                                        You're all caught up!
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        You've seen all posts in this group.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Empty state - Enhanced styling */}
                {!loading && posts.length === 0 && (
                    <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center border border-gray-50">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    Start the conversation
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Be the first to share something in this group!
                                </p>
                                <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                    <svg
                                        className="w-3 h-3 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Share your thoughts above
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading more indicator - Enhanced styling */}
                <div
                    ref={bottomLineRef}
                    className="w-full h-20 flex items-center justify-center"
                >
                    {loadingMore && (
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-50">
                            <div className="flex items-center space-x-3">
                                <Spinner />
                                <span className="text-sm text-gray-600 font-medium">
                                    Loading more posts...
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
