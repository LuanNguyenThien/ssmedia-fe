import PostForm from "@components/posts/post-form/PostForm";
import PostFormSkeleton from "@components/posts/post-form/PostFormSkeleton";
import Post from "@/components/posts/post/Post";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";
import useEffectOnce from "@hooks/useEffectOnce";
import { followerService } from "@services/api/followers/follower.service";
import { PostUtils } from "@services/utils/post-utils.service";
import { Utils } from "@services/utils/utils.service";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "@components/timeline/Timeline.scss";
import useLocalStorage from "@hooks/useLocalStorage";
import { postService } from "@services/api/post/post.service";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import LoadingMessage from "@/components/state/loading-message/LoadingMessage";
import { uniqBy } from "lodash";

import { socketService } from "@services/socket/socket.service";
const Timeline = ({ userProfileData, loading }) => {
    const { profile } = useSelector((state) => state.user);
    const { username } = useParams();
    const dispatch = useDispatch();
    const storedUsername = useLocalStorage("username", "get");

    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const bodyRef = useRef(null);
    const bottomRef = useRef(null);
    const appPosts = useRef([]);

    useInfiniteScroll(bodyRef, bottomRef, fetchPostData);

    // Fetch data function for infinite scroll
    function fetchPostData() {
        if (loadingMore || !userProfileData?._id) {
            return;
        }
        setLoadingMore(true);
        getPosts().finally(() => setLoadingMore(false));
    }

    // Modified getPosts function to support pagination
    const getPosts = useCallback(async () => {
        try {
            setLoadingMore(true);
            const response = await postService.getPostByUserId(
                userProfileData?._id,
                currentPage
            );

            if (response.data.posts && response.data.posts.length > 0) {
                if (currentPage === 1) {
                    // First page - replace posts
                    appPosts.current = [...response.data.posts];
                    setPosts(response.data.posts);
                } else {
                    // Subsequent pages - append posts
                    appPosts.current = [...posts, ...response.data.posts];
                    const allPosts = uniqBy(appPosts.current, "_id");
                    setPosts(allPosts);
                }
                // Increment page for next fetch
                setCurrentPage((prevPage) => prevPage + 1);

                return true;
            } else {
                return false;
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
            return false;
        } finally {
            setLoadingMore(false);
        }
    }, [userProfileData?._id, currentPage, posts, dispatch]);

    // Infinite scroll hook

    // Reset pagination when user changes
    useEffect(() => {
        if (userProfileData) {
            setCurrentPage(1);
            setPosts([]);
            appPosts.current = [];
            getPosts();
        }
    }, [userProfileData?._id]);

    const getUserFollowing = async () => {
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
    };
    const getReactionsByUsername = async () => {
        try {
            const reactionsResponse = await postService.getReactionsByUsername(
                storedUsername
            );
            dispatch(addReactions(reactionsResponse.data.reactions));
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    useEffectOnce(() => {
        getUserFollowing();
        getReactionsByUsername();
    });

    useEffect(() => {
        if (username !== profile?.username) {
            const firstPost = document.querySelectorAll(".post-body")[0];
            if (firstPost) {
                firstPost.style.marginTop = "0";
            }
        }
    }, [username, profile]);

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

                // Kiểm tra nếu đã tồn tại trong danh sách thì không thêm lại
                setPosts((prevPosts) => {
                    const exists = prevPosts.find((p) => p._id === newPost._id);
                    if (exists) return prevPosts;
                    return [newPost, ...prevPosts];
                });

                // Cập nhật lại danh sách following nếu chưa có
                if (!following.length) {
                    const followRes = await followerService.getUserFollowing();
                    setFollowing(followRes.data.following);
                }
            } catch (error) {
                console.error("Failed to unhide post", error);
            }
        };

        socketService?.socket?.on("hide post", handleHidePost);
        socketService?.socket?.on("unhide post", handleUnhidePost);

        return () => {
            socketService?.socket?.off("hide post", handleHidePost);
            socketService?.socket?.off("unhide post", handleUnhidePost);
        };
    }, [following]);

    useEffect(() => {
        PostUtils.socketIOPost(posts, setPosts, profile);
    }, [posts, profile]);

    return (
        <div className="size-full ">
            {loading && !posts.length && (
                <div className="timeline-wrapper-container-main">
                    <div style={{ marginBottom: "10px" }}>
                        <PostFormSkeleton />
                    </div>
                    <>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <div key={index}>
                                <PostSkeleton />
                            </div>
                        ))}
                    </>
                </div>
            )}

            {/* posts section */}

            <div
                ref={bodyRef}
                className="size-full flex flex-col gap-2 overflow-y-scroll"
            >
                {username === profile?.username && <PostForm />}

                {posts.length > 0 && (
                    <>
                        {posts.map((post) => (
                            <div key={post?._id}>
                                {(!Utils.checkIfUserIsBlocked(
                                    profile?.blockedBy,
                                    post?.userId
                                ) ||
                                    post?.userId === profile?._id) && (
                                    <>
                                        {PostUtils.checkPrivacy(
                                            post,
                                            profile,
                                            following
                                        ) && (
                                            <>
                                                <Post
                                                    post={post}
                                                    showIcons={
                                                        username ===
                                                        profile?.username
                                                    }
                                                />
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </>
                )}
                {loadingMore && (
                    <div className="timeline-wrapper-container-main">
                        <>
                            {[1, 2, 3, 4, 5].map((index) => (
                                <div key={index}>
                                    <PostSkeleton />
                                </div>
                            ))}
                        </>
                    </div>
                )}

                {/* Loading indicator for pagination */}
                <div
                    ref={bottomRef}
                    className="py-5 !h-[50px] mb-20 flex justify-center items-center"
                >
                    {loadingMore && (
                        <div className="flex justify-center items-center w-full h-full">
                            <div className="size-10">
                                <LoadingMessage />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {posts.length === 0 && (
                <div className="timeline-wrapper-container-main">
                    <div className="empty-page" data-testid="empty-page">
                        No post available
                    </div>
                </div>
            )}
        </div>
    );
};

Timeline.propTypes = {
    userProfileData: PropTypes.object,
    loading: PropTypes.bool,
};
export default Timeline;
