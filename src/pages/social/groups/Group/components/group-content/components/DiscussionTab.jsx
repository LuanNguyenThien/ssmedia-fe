import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaLock } from "react-icons/fa";
import { uniqBy } from "lodash";
import PostForm from "@components/posts/post-form/PostForm";
import Posts from "@components/posts/Posts";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import { PostUtils } from "@services/utils/post-utils.service";
import { socketService } from "@services/socket/socket.service";
import { followerService } from "@services/api/followers/follower.service";
import Spinner from "@components/spinner/Spinner";

export default function DiscussionTab({ group, canViewContent, onJoinGroup }) {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.user);
    const socket = socketService?.socket;

    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(2);
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
            const response = await postService.getAllPosts(currentPage);
            if (response.data.posts && response.data.posts.length > 0) {
                // Filter posts that belong to this group (in real app, this would be done server-side)
                const groupPosts = response.data.posts.filter(
                    (post) => post.groupId === group.id || Math.random() > 0.5 // Mock filtering
                );

                appPosts.current = [...posts, ...groupPosts];
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

    if (!canViewContent) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Content for members only
                </h3>
                <p className="text-gray-600 mb-6">
                    You need to join the group to see posts and discussions.
                </p>
                <button
                    onClick={onJoinGroup}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Join Group
                </button>
            </div>
        );
    }

    if (loading && posts.length === 0) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="bg-white rounded-lg shadow-sm p-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-skeleton-animation"></div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton-animation"></div>
                                <div className="h-3 bg-gray-200 rounded w-24 mt-2 animate-skeleton-animation"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-animation"></div>
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-animation"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 animate-skeleton-animation"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4" ref={bodyRef}>
            {/* Post Form - only show if user can post */}
            <PostForm groupId={group.id} />

            {/* Posts List */}
            <Posts
                allPosts={posts}
                postsLoading={loading}
                userFollowing={following}
                groupContext={group}
            />

            {/* End of posts message */}
            {currentPage > Math.ceil(totalPostsCount / PAGE_SIZE) &&
                posts.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        You've seen all posts in this group.
                    </div>
                )}

            {/* Empty state */}
            {!loading && posts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaLock className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No posts yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Be the first to share something in this group!
                    </p>
                </div>
            )}

            {/* Loading more indicator */}
            <div
                ref={bottomLineRef}
                style={{ marginBottom: "20px", height: "20px" }}
            >
                {loadingMore && (
                    <div className="flex justify-center items-center">
                        <Spinner />
                    </div>
                )}
            </div>
        </div>
    );
}
