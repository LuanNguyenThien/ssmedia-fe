import { useRef, useState, useEffect } from "react";
import { uniqBy, shuffle } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import "@pages/social/streams/Streams.scss";

import useEffectOnce from "@hooks/useEffectOnce";
import useLocalStorage from "@hooks/useLocalStorage";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { getPosts } from "@redux/api/posts";
import { getUserSuggestions } from "@redux/api/suggestion";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";

import { Utils } from "@services/utils/utils.service";
import { postService } from "@services/api/post/post.service";
import { PostUtils } from "@services/utils/post-utils.service";
import { followerService } from "@services/api/followers/follower.service";
import { socketService } from "@services/socket/socket.service";
import { userService } from "@/services/api/user/user.service";

import StreamsSkeleton from "./StreamsSkeleton";
import ModalContainer from "@components/modal/ModalContainer";
import PersonalizeModal from "@/components/personalize/PersonalizeModal";
import ThanksScreen from "@/components/personalize/ThanksScreen";
import PostForm from "@components/posts/post-form/PostForm";
import Spinner from "@components/spinner/Spinner";
import Suggestions from "@components/suggestions/Suggestions1";
import Posts from "@components/posts/Posts";
import { INTERESTS } from "@/components/personalize/constant";

const Streams = () => {
    const { profile } = useSelector((state) => state.user);
    const { allPosts } = useSelector((state) => state);
    const socket = socketService?.socket;
    const dispatch = useDispatch();

    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(2);
    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const bodyRef = useRef(null);
    const bottomLineRef = useRef();
    const appPosts = useRef([]);
    const storedUsername = useLocalStorage("username", "get");
    const [deleteSelectedPostId] = useLocalStorage("selectedPostId", "delete");
    useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
    const PAGE_SIZE = 10;
    const [loadingMore, setLoadingMore] = useState(false);

    const [isShowPersonalizeModal, setIsShowPersonalizeModal] = useState(false);
    const [isShowThanksScreen, setIsShowThanksScreen] = useState(false);

    function fetchPostData() {
        // if (loadingMore || currentPage > Math.ceil(totalPostsCount / PAGE_SIZE))
        if (loadingMore) {
            return;
        }
        setLoadingMore(true);
        getAllPosts().finally(() => setLoadingMore(false));
    }

    const getAllPosts = async () => {
        try {
            const response = await postService.getAllPosts(currentPage);
            if (response.data.posts && response.data.posts.length > 0) {
                const shuffledPosts = shuffle(response.data.posts || []);
                appPosts.current = [...posts, ...shuffledPosts];
                const allPosts = uniqBy(appPosts.current, "_id");
                setPosts(allPosts);
                setCurrentPage((prevPage) => prevPage + 1); // Increment page only when data is valid

                if (response.data.totalPosts) {
                    setTotalPostsCount(response.data.totalPosts);
                }

                return true; // Indicate posts were returned
            } else {
                // No more posts to load
                return false;
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to load posts.",
                "error",
                dispatch
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            profile?.user_hobbies?.subject?.length === 0 ||
            !profile?.user_hobbies?.subject
        ) {
            setIsShowPersonalizeModal(true);
        }
    }, [profile]);

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

                setFollowing((prev) => {
                    if (prev.length === 0) {
                        followerService.getUserFollowing().then((res) => {
                            setFollowing(res.data.following);
                        });
                    }
                    return prev;
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
    }, []);

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
            const response = await postService.getReactionsByUsername(
                storedUsername
            );
            dispatch(addReactions(response.data.reactions));
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
        deleteSelectedPostId();
        dispatch(getPosts());
        dispatch(getUserSuggestions());
    });

    useEffect(() => {
        setLoading(allPosts?.isLoading);
        // const orderedPosts = orderBy(allPosts?.posts, ['createdAt'], ['desc']);
        const orderedPosts = shuffle(allPosts?.posts || []);
        setPosts(orderedPosts);
        setTotalPostsCount(allPosts?.totalPostsCount);
    }, [allPosts]);

    useEffect(() => {
        PostUtils.socketIOPost(posts, setPosts, profile);
    }, [posts, profile]);

    useEffect(() => {
        const viewportHeight = window.innerHeight;
        console.log("Viewport Height:", viewportHeight);
        const headerDesktopElement =
            document.querySelector("div.header-desktop");
        const headerElement = document.querySelector("div.header-mb");
        const footerElement = document.querySelector("div.footer-mb");

        document.documentElement.style.setProperty(
            "--root-height",
            `${viewportHeight}px`
        );
        if (headerElement && footerElement) {
            const headerHeight = headerElement.offsetHeight;
            const footerHeight = footerElement.offsetHeight;
            const totalHeight = headerHeight + footerHeight;
            document.documentElement.style.setProperty(
                "--header-footer-height",
                `${totalHeight}px`
            );
        } else {
            const headerHeight = headerDesktopElement.offsetHeight;
            const footerHeight = 0; // Assuming no footer in this case
            const totalHeight = headerHeight + footerHeight;
            document.documentElement.style.setProperty(
                "--header-footer-height",
                `${totalHeight}px`
            );
        }
    }, []);

    const handleUpdateUserHobbies = async (selected) => {
        const updateData = {
            subject: INTERESTS.filter((interest) =>
                selected.includes(interest.label.toLowerCase())
            ).map((interest) => interest.value),
        };
        const stringifiedSubject = Utils.convertArrayToString(
            updateData.subject
        );

        console.log(stringifiedSubject);
        const response = await userService.updatePersonalHobby({
            subject: stringifiedSubject,
        });
        if (response) {
            setIsShowPersonalizeModal(false);
            setIsShowThanksScreen(true);
        }
    };

    return (
        <>
            {isShowPersonalizeModal && (
                <PersonalizeModal
                    onClose={() => setIsShowPersonalizeModal(false)}
                    onContinue={(selected) => {
                        handleUpdateUserHobbies(selected);
                        setIsShowPersonalizeModal(false);
                    }}
                />
            )}
            {isShowThanksScreen && (
                <ThanksScreen
                    onClose={() => {
                        setIsShowThanksScreen(false);
                        window.location.reload();
                    }}
                />
            )}
            <ModalContainer />
            {loading ? (
                <StreamsSkeleton />
            ) : (
                <div className="streams-content col-span-full">
                    <div
                        className="streams-post relative sm:pt-6 sm:px-6 bg-background-blur rounded-3xl gap-1 sm:gap-4"
                        ref={bodyRef}
                    >
                        <PostForm />
                        <Posts
                            allPosts={posts}
                            postsLoading={loading}
                            userFollowing={following}
                        />
                        <div>
                            {currentPage >
                                Math.ceil(totalPostsCount / PAGE_SIZE) && (
                                <div className="no-chat" data-testid="no-chat">
                                    You have read all posts.
                                </div>
                            )}
                        </div>
                        <div
                            ref={bottomLineRef}
                            style={{ marginBottom: "20px", height: "20px" }}
                        >
                            {loadingMore && (
                                <div className="absolute w-full h-max bottom-15 left-0 right-0 flex justify-center items-center">
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="streams-suggestions pl-4">
                        <Suggestions />
                    </div>
                </div>
            )}
        </>
    );
};

export default Streams;
