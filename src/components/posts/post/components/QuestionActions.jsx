import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { openModal } from "@redux/reducers/modal/modal.reducer";
import { useNavigate, useLocation } from "react-router-dom";
import AddAnswer from "@components/posts/post-modal/post-add/AddAnswer";

const QuestionActions = ({ post }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [answerCount, setAnswerCount] = useState(post.answerCount || 0);
    const currentPath = useLocation().pathname.split("/")[3];

    const isCurrentPostModal = useSelector(
        (state) =>
            state.modal.isOpen &&
            state.modal.type === "add" &&
            state.modal.modalType === "createanswer" &&
            state.modal.data?.questionId === post._id
    );

    const openAnswerForm = () => {
        dispatch(
            openModal({
                type: "add",
                data: {
                    questionId: post._id,
                    question: post.post,
                    questionUserId: post.userId,
                    username: post.username,
                    gifUrl: post.gifUrl,
                    imgId: post.imgId,
                    imgVersion: post.imgVersion,
                    videoId: post.videoId,
                    videoVersion: post.videoVersion,
                },
                modalType: "createanswer",
            })
        );
    };

    const navigateToQuestionDetail = () => {
        navigate(`/app/social/question/${post._id}`);
    };

    const getAnswerCount = useCallback(async () => {
        if (!post.htmlPost) {
            // Only get answer count for questions
            try {
                setAnswerCount(post.answersCount || 0);
            } catch (error) {
                console.error("Error fetching answer count:", error);
            }
        }
    }, [post._id, post.htmlPost]);

    useEffect(() => {
        if (!post.htmlPost) {
            // Only get answer count for questions
            getAnswerCount();
        }
    }, [getAnswerCount, post.htmlPost]);

    // Only render for questions (not answers)
    if (post.htmlPost) {
        return null;
    }

    return (
        <>
            {currentPath !== "question" && (
                <div className="question-action flex justify-start items-center gap-2 float-end mt-2">
                    {/* Answer Button */}
                    <button
                        aria-label="Answer this question"
                        className=" py-1 px-2 flex items-center justify-center w-auto h-full rounded-lg focus:outline-none 
                    transition-all duration-200 ease-linear border text-primary-black/50 border-gray-300 hover:text-primary gap-1"
                        onClick={openAnswerForm}
                        type="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openAnswerForm();
                            }
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                        </svg>

                        <span className="text-xs md:text-sm font-medium">
                            Answer
                        </span>
                    </button>

                    {/* Answer Count and Navigation */}
                    {answerCount > 0 ? (
                        <div
                            className="text-xs md:text-sm text-center font-bold text-primary-black/70 cursor-pointer hover:underline hover:text-primary transition-colors duration-200"
                            onClick={navigateToQuestionDetail}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    navigateToQuestionDetail();
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`View ${answerCount} ${
                                answerCount > 1 ? "answers" : "answer"
                            } to this question`}
                        >
                            {answerCount}{" "}
                            {answerCount > 1 ? "answers" : "answer"}
                        </div>
                    ) : (
                        <div className="text-xs md:text-sm text-center font-medium text-primary-black/50 cursor-pointer hover:underline hover:text-primary transition-colors duration-200">
                            No answers yet
                        </div>
                    )}
                </div>
            )}
            {/* Modal for adding answer */}
            {isCurrentPostModal && <AddAnswer questionId={post._id} />}
        </>
    );
};

QuestionActions.propTypes = {
    post: PropTypes.object.isRequired,
};

export default QuestionActions;
