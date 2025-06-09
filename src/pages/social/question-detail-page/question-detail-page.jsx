import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postService } from "@services/api/post/post.service";
import { answerService } from "@services/api/answer/answer.service";
import { Utils } from "@services/utils/utils.service";
import Post from "@/components/posts/post/Post";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";
import { PostUtils } from "@services/utils/post-utils.service";
import AddAnswer from "@components/posts/post-modal/post-add/AddAnswer";
import { openModal } from "@redux/reducers/modal/modal.reducer";
import { FaPlus } from "react-icons/fa";
import "@pages/social/saves/SavePage.scss";

const QuestionDetail = () => {
    const { type, isOpen } = useSelector((state) => state.modal);
    const { questionId } = useParams();
    const { profile } = useSelector((state) => state.user);
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answersLoading, setAnswersLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await postService.getPost(questionId);
                if (response.data && response.data.post) {
                    setQuestion(response.data.post);
                } else {
                    Utils.dispatchNotification(
                        "Question not found",
                        "error",
                        dispatch
                    );
                }
            } catch (error) {
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error fetching question",
                    "error",
                    dispatch
                );
            } finally {
                setLoading(false);
            }
        };

        const loadAnswers = async (page = 1) => {
            try {
                setAnswersLoading(true);
                const response = await answerService.getAnswersForQuestion(
                    questionId,
                    page
                );
                if (response?.data?.answers) {
                    if (page === 1) {
                        setAnswers(response.data.answers);
                    } else {
                        setAnswers((prev) => [
                            ...prev,
                            ...response.data.answers,
                        ]);
                    }
                    setHasMoreAnswers(response.data.answers.length === 10);
                }
            } catch (error) {
                console.error("Error loading answers:", error);
            } finally {
                setAnswersLoading(false);
            }
        };

        fetchQuestion();
        loadAnswers();
    }, [questionId, dispatch]);

    const handleAddAnswer = () => {
        dispatch(
            openModal({
                type: "add",
                data: {
                    questionId: question._id,
                    question: question.post,
                    questionUserId: question.userId,
                    username: question.username,
                    gifUrl: question.gifUrl,
                    imgId: question.imgId,
                    imgVersion: question.imgVersion,
                    videoId: question.videoId,
                    videoVersion: question.videoVersion,
                },
                modalType: "createanswer",
            })
        );
    };

    const loadMoreAnswers = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadAnswers(nextPage);
    };

    return (
        <>
            <div
                className="saves col-span-full sm:rounded-t-3xl size-full flex justify-center items-center pt-4"
                data-testid="question-detail"
            >
                <div
                    className="saves-content"
                    style={{ height: "100%", width: "100%" }}
                >
                    <div
                        className="saves-post w-full"
                        style={{ height: "85vh" }}
                    >
                        <div
                            className="posts-container w-full overflow-y-auto"
                            data-testid="question-answers"
                        >
                            <div className="bg-white rounded-lg rounded-b-none shadow-sm">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 font-semibold text-xs">
                                                    Q
                                                </span>
                                            </span>
                                            Question
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            {/* Question Section */}
                            {!loading && question && (
                                <div
                                    key={question._id}
                                    data-testid="question-item"
                                    className=" bg-primary-white !border-t-none"
                                >
                                    {(!Utils.checkIfUserIsBlocked(
                                        profile?.blockedBy,
                                        question?.userId
                                    ) ||
                                        question?.userId === profile?._id) && (
                                        <>
                                            {PostUtils.checkPrivacy(
                                                question,
                                                profile,
                                                profile?.following
                                            ) && (
                                                <>
                                                    <Post
                                                        post={question}
                                                        showIcons={false}
                                                    />
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Loading skeleton for question */}
                            {loading && !question && (
                                <div className="mb-4">
                                    <PostSkeleton />
                                </div>
                            )}

                            {/* Divider */}
                            {!loading && question && (
                                <div className="w-full flex justify-center items-center">
                                    <div className="border-t border-gray-200 my-3 w-1/3"></div>
                                </div>
                            )}

                            {/* Answers Header */}
                            {!loading && question && (
                                <div className="bg-white rounded-lg shadow-sm mb-2">
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                <span className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-xs">
                                                        A
                                                    </span>
                                                </span>
                                                Answers ({answers.length})
                                            </h2>
                                            <button
                                                onClick={handleAddAnswer}
                                                className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100  px-4 py-2 rounded-full text-sm"
                                            >
                                                <FaPlus size={12} />
                                                Add your answer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Answers List */}
                            {!loading && question && answers.length > 0 && (
                                <div className="space-y-4">
                                    {answers.map((answer, index) => (
                                        <div
                                            key={answer._id || index}
                                            data-testid="answer-item"
                                        >
                                            {(!Utils.checkIfUserIsBlocked(
                                                profile?.blockedBy,
                                                answer?.userId
                                            ) ||
                                                answer?.userId ===
                                                    profile?._id) && (
                                                <>
                                                    {PostUtils.checkPrivacy(
                                                        answer,
                                                        profile,
                                                        profile?.following
                                                    ) && (
                                                        <>
                                                            <Post
                                                                post={answer}
                                                                showIcons={true}
                                                            />
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}

                                    {/* Load More Button */}
                                    {hasMoreAnswers && (
                                        <div className="text-center py-4">
                                            <button
                                                onClick={loadMoreAnswers}
                                                disabled={answersLoading}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-50"
                                            >
                                                {answersLoading
                                                    ? "Loading..."
                                                    : "Load More Answers"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* No Answers State */}
                            {!loading && question && answers.length === 0 && (
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-gray-400 text-2xl">
                                                💬
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-lg mb-2">
                                            No answers yet
                                        </p>
                                        <p className="text-gray-400 mb-6">
                                            Be the first to answer this
                                            question!
                                        </p>
                                        <button
                                            onClick={handleAddAnswer}
                                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full"
                                        >
                                            Write First Answer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Answer Modal */}
            {isOpen && type === "add" && <AddAnswer />}
        </>
    );
};

export default QuestionDetail;
