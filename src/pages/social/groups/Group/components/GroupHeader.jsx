import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaGlobe,
    FaLock,
    FaEyeSlash,
    FaUserPlus,
    FaShare,
    FaCheck,
    FaClock,
    FaBan,
    FaCog,
} from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";

const GroupHeader = ({
    group,
    groupId,
    membershipStatus,
    onJoinGroup,
    onLeaveGroup,
    onCancelRequest,
}) => {
    const navigate = useNavigate();

    const getVisibilityIcon = () => {
        switch (group?.visibility) {
            case "public":
                return <FaGlobe className="text-green-500" />;
            case "private":
                return <FaLock className="text-yellow-500" />;
            case "secret":
                return <FaEyeSlash className="text-red-500" />;
            default:
                return <FaGlobe className="text-green-500" />;
        }
    };

    const getVisibilityText = () => {
        switch (group?.visibility) {
            case "public":
                return "Public Group";
            case "private":
                return "Private Group";
            case "secret":
                return "Secret Group";
            default:
                return "Public Group";
        }
    };

    const getMembershipButton = () => {
        const baseClasses =
            "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2";

        switch (membershipStatus) {
            case "member":
            case "admin":
            case "moderator":
                return (
                    <button
                        onClick={onLeaveGroup}
                        className={`${baseClasses} bg-green-100 text-green-700 hover:bg-green-200`}
                    >
                        <FaCheck size={16} />
                        Joined
                    </button>
                );
            case "pending":
                return (
                    <button
                        onClick={onCancelRequest}
                        className={`${baseClasses} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`}
                    >
                        <FaClock size={16} />
                        Pending
                    </button>
                );
            case "banned":
                return (
                    <button
                        disabled
                        className={`${baseClasses} bg-red-100 text-red-700 cursor-not-allowed`}
                    >
                        <FaBan size={16} />
                        Banned
                    </button>
                );
            default:
                return (
                    <button
                        onClick={onJoinGroup}
                        className={`${baseClasses} bg-blue-500 text-white hover:bg-blue-600`}
                    >
                        <FaUserPlus size={16} />
                        {group?.privacy.whoCanJoin === "anyone"
                            ? "Join"
                            : "Request to Join"}
                    </button>
                );
        }
    };

    return (
        <div className="bg-white p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-6">
                    <div className="size-20 rounded-full border-2 overflow-hidden">
                        <img
                            src={group.groupAvatar}
                            alt="Group avatar"
                            className="w-auto h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {group.name}
                            {group.isVerified && (
                                <span className="ml-2 text-blue-500">✓</span>
                            )}
                        </h1>
                        <div className="flex items-center text-gray-600 text-sm gap-2 mb-2">
                            {getVisibilityIcon()}
                            <span>{getVisibilityText()}</span>
                            <span>•</span>
                            <FaUsers className="text-gray-500" />
                            <span>
                                {group.memberCount.toLocaleString()} members
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {(membershipStatus === "member" ||
                        membershipStatus === "admin" ||
                        membershipStatus === "moderator") && (
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            aria-label="Invite members"
                        >
                            <FaUserPlus size={16} />
                            Invite
                        </button>
                    )}

                    <button
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        aria-label="Share group"
                    >
                        <FaShare size={16} />
                        Share
                    </button>

                    {getMembershipButton()}

                    {(membershipStatus === "admin" ||
                        membershipStatus === "moderator") && (
                        <button
                            onClick={() =>
                                navigate(`/social/groups/${groupId}/settings`)
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            aria-label="Group settings"
                        >
                            <FaCog size={16} />
                        </button>
                    )}

                    <button
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        aria-label="More options"
                    >
                        <HiDotsHorizontal size={20} />
                    </button>
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
