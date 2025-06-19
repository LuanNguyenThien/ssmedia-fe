import { FaLock } from "react-icons/fa";

export default function DiscussionTabBlock({ onJoinGroup }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Content for members only
            </h3>
            <p className="text-gray-600 mb-6">
                You need to join the group to see posts and discussions.
            </p>
            <button
                onClick={onJoinGroup}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Join Group
            </button>
        </div>
    );
}
