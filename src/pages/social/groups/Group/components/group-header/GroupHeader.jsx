import PropTypes from "prop-types";
import { FaUsers, FaGlobe, FaLock } from "react-icons/fa";
import GroupActionButtons from "./GroupActionButtons";
import { useMemo } from "react";

const GroupHeader = ({
    group,
    groupId,
    membershipStatus,
    onJoinGroup,
    onLeaveGroup,
    onCancelRequest,
    setIsShowEditGroup,
    isAdmin,
}) => {
    const activeMembers = useMemo(() => {
        return (
            group.members?.filter((member) => member.status === "active") || []
        );
    }, [group]);

    return (
        <div className="bg-white px-4 py-4 shadow-sm sm:px-6">
            {/* Mobile Layout */}
            <div className="block md:hidden">
                {/* Group Info */}
                <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                        {group.name}
                        {group.isVerified && (
                            <span className="ml-2 text-blue-500">✓</span>
                        )}
                    </h1>
                    <div className="flex items-center text-gray-600 text-sm gap-2">
                        {group.privacy === "public" ? (
                            <FaGlobe className="text-blue-500" />
                        ) : (
                            <FaLock className="text-gray-500" />
                        )}
                        <span>
                            {group.privacy === "public"
                                ? "Public Group"
                                : "Private Group"}
                        </span>
                        <span>•</span>
                        <FaUsers className="text-gray-500" />
                        <span>
                            {(activeMembers.length || 0).toLocaleString()}{" "}
                            members
                        </span>
                    </div>
                </div>

                <GroupActionButtons
                    group={group}
                    groupId={groupId}
                    membershipStatus={membershipStatus}
                    onJoinGroup={onJoinGroup}
                    onLeaveGroup={onLeaveGroup}
                    onCancelRequest={onCancelRequest}
                    isMobile={true}
                    setIsShowEditGroup={setIsShowEditGroup}
                    isAdmin={isAdmin}
                />
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex justify-between items-center">
                <div className="w-full flex items-center justify-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 w-full text-center">
                            {group.name}
                            {group.isVerified && (
                                <span className="ml-2 text-blue-500">✓</span>
                            )}
                        </h1>
                        <div className="flex items-center justify-center text-gray-600 text-sm gap-2 mb-2">
                            {group.privacy === "public" ? (
                                <FaGlobe className="text-blue-500" />
                            ) : (
                                <FaLock className="text-gray-500" />
                            )}
                            <span>
                                {group.privacy === "public"
                                    ? "Public Group"
                                    : "Private Group"}
                            </span>
                            <span>•</span>
                            <FaUsers className="text-gray-500" />
                            <span>
                                {(activeMembers.length || 0).toLocaleString()}{" "}
                                members
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

GroupHeader.propTypes = {
    group: PropTypes.object.isRequired,
    groupId: PropTypes.string.isRequired,
    membershipStatus: PropTypes.string.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
    onLeaveGroup: PropTypes.func.isRequired,
    onCancelRequest: PropTypes.func.isRequired,
};

export default GroupHeader;
