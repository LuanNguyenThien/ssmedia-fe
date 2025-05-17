import { FaTrash, FaUndoAlt } from "react-icons/fa"; // Import icons

const OptionSelector = ({ chat, deleteMessage }) => {
    return (
        <div className="relative inline-block text-left p-4">
            <div className="absolute right-0 bottom-0 mt-2 w-52 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
                <div
                    className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-red-50 transition-colors duration-200 border-b border-gray-100 text-gray-700 hover:text-red-600"
                    onClick={() => deleteMessage(chat, "deleteForMe")}
                >
                    <FaTrash className="text-red-500" size={14} />
                    <span className="font-medium">Delete this message</span>
                </div>
                <div
                    className="flex w-fit items-center gap-2 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 text-gray-700 hover:text-blue-600"
                    onClick={() => deleteMessage(chat, "deleteForAll")}
                >
                    <FaUndoAlt className="text-blue-500" size={14} />
                    <span className="font-medium w-max">
                        Recall this message
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OptionSelector;
