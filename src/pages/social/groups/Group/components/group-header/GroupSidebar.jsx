import PropTypes from "prop-types";
import { FaLock, FaUsers, FaCalendarAlt } from "react-icons/fa";

const GroupSidebar = ({ group, canViewContent }) => {
    return (
        <div className="space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-gray-700 mb-4">{group.shortDescription}</p>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 flex items-center justify-center">
                            {group.visibility === "public" ? (
                                <FaUsers className="text-green-500" />
                            ) : group.visibility === "private" ? (
                                <FaLock className="text-yellow-500" />
                            ) : (
                                <FaLock className="text-red-500" />
                            )}
                        </div>
                        <span>
                            {group.visibility === "public"
                                ? "Public Group"
                                : group.visibility === "private"
                                ? "Private Group"
                                : "Secret Group"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <FaUsers />
                        </div>
                        <span>{group.memberCount.toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <FaCalendarAlt />
                        </div>
                        <span>Created on {new Date(group.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

GroupSidebar.propTypes = {
    group: PropTypes.object.isRequired,
    canViewContent: PropTypes.bool.isRequired,
};

export default GroupSidebar; 