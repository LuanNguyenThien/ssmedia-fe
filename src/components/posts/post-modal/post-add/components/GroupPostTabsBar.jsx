import { FaTimes } from "react-icons/fa";

const GroupPostTabsBar = ({ closePostModal }) => {
    return (
        <div className="w-full h-max border-b border-gray-200 flex justify-between items-center !rounded-t-2xl overflow-hidden">
            <div className="w-full py-4  flex flex-col justify-center items-center text-gray-800">
                <span className="text-primary text-xl font-bold">
                    Create Post For Your Group
                </span>
                <span className="text-gray-500 text-sm font-lg">
                    Spread your openness, kindness, and joy to everyone around
                    you.
                </span>
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

export default GroupPostTabsBar;
