import PropTypes from "prop-types";
import { useMemo } from "react";
import { FaLock, FaUsers, FaCalendarAlt, FaGlobe } from "react-icons/fa";

const GroupSidebar = ({ group }) => {
    const activeMembers =
        group.members?.filter((member) => member.status === "active") || [];

    const groupVisibility = useMemo(() => {
        return group.privacy === "public" ? "Public" : "Private";
    }, [group]);

    return (
        <div className="space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold underline mb-3">About</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 flex items-center justify-center">
                            {groupVisibility === "Public" ? (
                                <FaGlobe className="text-primary" />
                            ) : (
                                <FaLock className="text-gray-700" />
                            )}
                        </div>
                        <span>{groupVisibility}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <FaUsers />
                        </div>
                        <span>
                            {(activeMembers.length || 0).toLocaleString()}{" "}
                            members on this group
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <FaCalendarAlt />
                        </div>
                        <span>
                            Created on{" "}
                            {new Date(group.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <h3 className="text-lg font-semibold underline mt-3 mb-3">
                    Description
                </h3>
                {group.description && (
                    <div className="flex flex-col gap-2 text-gray-700 text-sm h-auto line-clamp-5">
                        <span>{group.description}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

GroupSidebar.propTypes = {
    group: PropTypes.object.isRequired,
    canViewContent: PropTypes.bool.isRequired,
};

export default GroupSidebar;
