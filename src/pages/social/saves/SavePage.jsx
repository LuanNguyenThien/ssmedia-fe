import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "@pages/social/saves/SavePage.scss";
import useEffectOnce from "@hooks/useEffectOnce";
import Posts from "@components/posts/Posts";
import { Utils } from "@services/utils/utils.service";
import { postService } from "@services/api/post/post.service";
import { orderBy, uniqBy } from "lodash";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import useLocalStorage from "@hooks/useLocalStorage";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";
import { followerService } from "@services/api/followers/follower.service";
import { PostUtils } from "@/services/utils/post-utils.service";
import LoadingSpinner from "@/components/state/LoadingSpinner";
import LoadingMessage from "@/components/state/loading-message/LoadingMessage";

const SavePage = () => {
    const { profile } = useSelector((state) => state.user);
    const [postSaves, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const bodyRef = useRef(null);
    const bottomLineRef = useRef();
    const appPosts = useRef([]);
    const dispatch = useDispatch();
    const storedUsername = useLocalStorage("username", "get");
    const [deleteSelectedPostId] = useLocalStorage("selectedPostId", "delete");
    useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
    const PAGE_SIZE = 5;

    function fetchPostData() {
        if (
            currentPage === 1 ||
            currentPage > Math.ceil(totalPostsCount / PAGE_SIZE)
        ) {
            setCurrentPage(currentPage + 1);
            getAllFavPosts();
        }
    }

    const getAllFavPosts = async () => {
        try {
            setIsLoading(true);
            const response = await postService.getAllFavPosts(currentPage);
            if (response.data.favposts.length > 0) {
                if (currentPage === 1) {
                    appPosts.current = [...response.data.favposts];
                    setPosts(response.data.favposts);
                } else {
                    setPosts([...postSaves, ...response.data.favposts]);
                    console.log(postSaves);
                }
            }
            setLoading(false);
            setIsLoading(false);
        } catch (error) {
            Utils.dispatchNotification(error, "error", dispatch);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTotalPostsCount(postSaves.length);
    }, [postSaves]);

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
        fetchPostData();
        // getAllFavPosts();
        // dispatch(getFavPosts());
        // dispatch(getUserSuggestions());
    });

    useEffect(() => {
        PostUtils.socketIOPost(postSaves, setPosts, profile);
    }, [postSaves]);

    // useEffect(() => {
    //   setLoading(allPosts?.isLoading);
    //   const orderedPosts = orderBy(allPosts?.posts, ['createdAt'], ['desc']);
    //   setPosts(orderedPosts);
    //   setTotalPostsCount(allPosts?.totalPostsCount);
    // }, [allPosts]);

    // useEffect(() => {
    //   PostUtils.socketIOPost(postSaves, setPosts);
    // }, [postSaves]);

    return (
        <div className="saves col-span-full w-full sm:rounded-t-3xl pt-1 sm:pt-4 relative">
            {postSaves.length > 0 && (
                <div
                    ref={bodyRef}
                    className="saves-post sm:!px-[10vw] flex-col w-full h-full !max-h-[85vh] overflow-y-scroll"
                >
                    <Posts
                        allPosts={postSaves}
                        postsLoading={loading}
                        userFollowing={following}
                    />
                    <div
                        ref={bottomLineRef}
                        className="h-max mb-[60px] w-full relative"
                    >
                        {isLoading && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-max flex justify-center items-center">
                                <LoadingMessage />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!loading && postSaves.length === 0 && (
                <div
                    className="empty-page"
                    data-testid="empty-page"
                    ref={bodyRef}
                >
                    No post saved available
                    <div ref={bottomLineRef}></div>
                </div>
            )}
        </div>
    );
};

export default SavePage;
