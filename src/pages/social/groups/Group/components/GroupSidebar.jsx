import PropTypes from "prop-types";
import { FaLock, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

const GroupSidebar = ({ group, canViewContent }) => {
    // Determine if user can view members list
    const canViewMembers = 
        canViewContent || 
        group.privacy?.whoCanSeeMembers === "everyone";

    // Determine if user can view rules
    const canViewRules = 
        canViewContent || 
        group.visibility === "public";

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
                    {group.location && (
                        <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <FaMapMarkerAlt />
                            </div>
                            <span>{group.location}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <FaCalendarAlt />
                        </div>
                        <span>Created on {new Date(group.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Rules Section - Only show if user can view */}
            {canViewRules && group.rules && group.rules.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-semibold mb-3">Group Rules</h3>
                    <ul className="space-y-2">
                        {group.rules.map((rule, index) => (
                            <li key={index} className="flex gap-2">
                                <span className="font-medium text-gray-700">
                                    {index + 1}.
                                </span>
                                <span className="text-gray-700">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Admins Section */}
            {canViewMembers && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-semibold mb-3">Administrators</h3>
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Admins
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {group.admins.map((admin, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                                >
                                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                        <FaShieldAlt className="text-blue-600" />
                                    </div>
                                    <span className="text-sm">{admin}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {group.moderators && group.moderators.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Moderators
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {group.moderators.map((mod, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                                    >
                                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                            <FaShieldAlt className="text-green-600" />
                                        </div>
                                        <span className="text-sm">{mod}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

GroupSidebar.propTypes = {
    group: PropTypes.object.isRequired,
    canViewContent: PropTypes.bool.isRequired,
};

export default GroupSidebar; 