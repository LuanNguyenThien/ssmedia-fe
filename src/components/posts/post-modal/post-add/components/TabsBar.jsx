import { useDispatch, useSelector } from "react-redux";
import { setModalType } from "@redux/reducers/modal/modal.reducer";
import { FaTimes } from "react-icons/fa";

const TabsBar = ({ closePostModal }) => {
    const { modalType } = useSelector((state) => state.modal);
    const dispatch = useDispatch();
    const handlePostTypeChange = (value) => {
        dispatch(setModalType(value));
    };
    return (
        <div className="w-full h-max border-b border-gray-200 flex justify-between items-center !rounded-t-2xl overflow-hidden">
            {/* <div className="relative w-fit">
                <select
                    className="appearance-none text-lg font-semibold bg-white text-gray-800 rounded-full px-4 py-2 pr-10 transition duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={postType}
                    onChange={handlePostTypeChange}
                >
                    <option value="createpost">📝 Create Post</option>
                    <option value="createquestion">❓ Create Question</option>
                </select>
                <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500">
                    ▼
                </div>
            </div> */}
            <div className="w-full  flex flex-row justify-between items-center text-xs sm:text-sm font-semibold text-gray-800">
                <button
                    onClick={() => handlePostTypeChange("createpost")}
                    className={`size-full py-4 flex items-center justify-center gap-2 transition duration-200 hover:bg-gray-100 ${
                        modalType === "createpost"
                            ? "bg-primary/5 border-b border-b-primary text-primary "
                            : ""
                    }`}
                >
                    {" "}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                    </svg>
                    Create Post
                </button>
                <button
                    onClick={() => handlePostTypeChange("createquestion")}
                    className={`size-full  py-4 flex items-center justify-center gap-2 transition duration-200 hover:bg-gray-100 ${
                        modalType === "createquestion"
                            ? "bg-primary/5 border-b border-b-primary text-primary "
                            : ""
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                    </svg>
                    Create Question
                </button>
            </div>

            <button
                className="absolute -top-2 -right-2 border border-gray-200 -translate-x-2 sm:translate-x-0 bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 p-2"
                onClick={closePostModal}
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default TabsBar;
