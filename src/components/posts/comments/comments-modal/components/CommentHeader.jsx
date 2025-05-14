import { useDispatch } from "react-redux";
import { closeModal } from "@redux/reducers/modal/modal.reducer";
import PropTypes from "prop-types";

const CommentHeader = ({ title, commentCount }) => {
    const dispatch = useDispatch();

    return (
        <div className="flex w-full justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                {commentCount > 0 && (
                    <span className="bg-primary text-white text-sm font-medium px-2 py-0.5 rounded-full">
                        {commentCount}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="flex items-center gap-1 text-gray-600 text-sm font-medium hover:text-gray-900"
                    onClick={() => {
                        dispatch(closeModal());
                    }}
                >
                    <span>Hide comments</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

CommentHeader.propTypes = {
    title: PropTypes.string.isRequired,
    commentCount: PropTypes.number,
};

CommentHeader.defaultProps = {
    commentCount: 0,
};

export default CommentHeader;
