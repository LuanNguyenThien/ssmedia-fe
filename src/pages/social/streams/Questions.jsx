import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@components/spinner/Spinner";
import "@pages/social/streams/Streams.scss"; // Có thể tạo stylesheet riêng nếu cần
import Suggestions from "@components/suggestions/Suggestions1";
import { getUserSuggestions } from "@redux/api/suggestion";
import useEffectOnce from "@hooks/useEffectOnce";
import PostForm from "@components/posts/post-form/PostForm";
import Posts from "@components/posts/Posts";
import { Utils } from "@services/utils/utils.service";
import { postService } from "@services/api/post/post.service";
// import { getQuestions } from "@redux/api/posts"; // Thay đổi từ getPosts sang getQuestions
import { uniqBy, shuffle } from "lodash";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { PostUtils } from "@services/utils/post-utils.service";
import useLocalStorage from "@hooks/useLocalStorage";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";
import { followerService } from "@services/api/followers/follower.service";
import StreamsSkeleton from "../streams/StreamsSkeleton";
import ModalContainer from "@components/modal/ModalContainer";
import { socketService } from "@services/socket/socket.service";

const Questions = () => {
    const { allQuestions } = useSelector((state) => state); // Thay đổi từ allPosts sang allQuestions
    const socket = socketService?.socket;
    const [questions, setQuestions] = useState([]); // Thay đổi tên biến
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(2);
    const [totalQuestionsCount, setTotalQuestionsCount] = useState(0); // Thay đổi tên biến
    const bodyRef = useRef(null);
    const bottomLineRef = useRef();
    const appQuestions = useRef([]); // Thay đổi tên biến
    const dispatch = useDispatch();
    const storedUsername = useLocalStorage("username", "get");
    const [deleteSelectedPostId] = useLocalStorage("selectedPostId", "delete");
    useInfiniteScroll(bodyRef, bottomLineRef, fetchQuestionData); // Thay đổi tên hàm
    const PAGE_SIZE = 10;
    const [loadingMore, setLoadingMore] = useState(false);
    const { profile } = useSelector((state) => state.user);

    function fetchQuestionData() { // Đổi tên hàm
        if (loadingMore) {
            return;
        }

        console.log("fetching questions");
        setLoadingMore(true);
        getAllQuestions().finally(() => setLoadingMore(false)); // Đổi tên hàm gọi
    }

    const getAllQuestions = async () => { // Đổi tên hàm và phương thức gọi API
        try {
            const response = await postService.getAllQuestions(currentPage);
            if (response.data.questions && response.data.questions.length > 0) { // Thay đổi thuộc tính
                const shuffledQuestions = shuffle(response.data.questions || []);
                appQuestions.current = [...questions, ...shuffledQuestions];
                const allQuestions = uniqBy(appQuestions.current, "_id");
                setQuestions(allQuestions);
                setCurrentPage((prevPage) => prevPage + 1);

                if (response.data.totalQuestions) { // Thay đổi thuộc tính
                    setTotalQuestionsCount(response.data.totalQuestions);
                }

                return true;
            } else {
                return false;
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to load questions.",
                "error",
                dispatch
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleHidePost = ({ postId }) => {
            setQuestions((prevQuestions) =>
                prevQuestions.filter((question) => question._id !== postId)
            );
        };

        const handleUnhidePost = async ({ postId }) => {
            try {
                const response = await postService.getPost(postId);
                const newQuestion = response.data.post;

                setQuestions((prevQuestions) => {
                    const exists = prevQuestions.find((q) => q._id === newQuestion._id);
                    if (exists) return prevQuestions;
                    return [newQuestion, ...prevQuestions];
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
                console.error("Failed to unhide question", error);
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
        // dispatch(getQuestions()); // Thay đổi sang getQuestions
        dispatch(getUserSuggestions());
    });

    useEffect(() => {
        setLoading(allQuestions?.isLoading);
        const orderedQuestion = shuffle(allQuestions?.questions || []);
        setQuestions(orderedQuestion);
        setTotalQuestionsCount(allQuestions?.totalQuestionsCount);
    }, [allQuestions]);

    useEffect(() => {
        PostUtils.socketIOPost(questions, setQuestions, profile);
    }, [questions, profile]);

    useEffect(() => {
        const viewportHeight = window.innerHeight;
        const headerDesktopElement = document.querySelector("div.header-desktop");
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
            const headerHeight = headerDesktopElement ? headerDesktopElement.offsetHeight : 0;
            const totalHeight = headerHeight;
            document.documentElement.style.setProperty(
                "--header-footer-height",
                `${totalHeight}px`
            );
        }
    }, []);

    return (
        <>
            <ModalContainer />
            {loading ? (
                <StreamsSkeleton />
            ) : (
                <div className="streams-content col-span-full">
                    
                    <div
                        className="streams-post relative sm:pt-6 sm:px-6 bg-background-blur rounded-3xl gap-1 sm:gap-4"
                        ref={bodyRef}
                    >
                        <div className="mb-4 px-4 md:px-6">
                            <h1 className="text-2xl font-bold text-gray-800">Questions</h1>
                            <p className="text-gray-500">Discover and answer questions from the community</p>
                        </div>
                        <PostForm />
                        <Posts
                            allPosts={questions}
                            postsLoading={loading}
                            userFollowing={following}
                            isQuestionPage={true}
                        />
                        <div>
                            {currentPage >
                                Math.ceil(totalQuestionsCount / PAGE_SIZE) && (
                                <div className="no-chat" data-testid="no-chat">
                                    You have read all questions.
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

export default Questions;