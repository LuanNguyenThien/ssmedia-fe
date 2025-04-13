const OptionSelector = ({ chat, deleteMessage }) => {
    return (
        <div className="relative inline-block text-left p-4">
            <div className="absolute right-0 bottom-0  mt-2 w-40 bg-white shadow-lg rounded-xl border text-primary-black ">
                <div
                    className="flex items-center p-2 cursor-pointer hover:text-red-500"
                    onClick={() => deleteMessage(chat, "deleteForMe")}
                >
                    Delete message
                </div>
                <div
                    className="flex items-center p-2 cursor-pointer hover:text-red-500"
                    onClick={() => deleteMessage(chat, "deleteForAll")}
                >
                    Recall message for all
                </div>
            </div>
        </div>
    );
};

export default OptionSelector;
