import PropTypes from "prop-types";
import { useState } from "react";
import {
    FaPlus,
    FaCheck,
    FaClock,
    FaCog,
    FaUserPlus,
    FaUserMinus,
    FaEdit,
    FaTrash,
    FaChevronDown,
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import InviteMembers from "../InviteMembers";
import { groupService } from "@/services/api/group/group.service";
import { Utils } from "@/services/utils/utils.service";
import { useDispatch } from "react-redux";
const   GroupActionButtons = ({
    group,
    groupId,
    membershipStatus,
    onJoinGroup,
    onLeaveGroup,
    onCancelRequest,
    isMobile = false,
    setIsShowEditGroup = () => {},
}) => {
    const [showMembershipDropdown, setShowMembershipDropdown] = useState(false);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const dispatch = useDispatch(); 
    const handleEditGroup = () => {
        setIsShowEditGroup(true);
        setShowSettingsDropdown(false);
    };

    const handleDeleteGroup = async () => {
      try {
        const response = await groupService.deleteGroup(groupId);
        console.log("Group deleted successfully:", response);
        Utils.dispatchNotification(
          response.data?.message || "Group deleted successfully",
          "success",
          dispatch
        );
        setShowSettingsDropdown(false);
        
      } catch (err) {
        console.error("Failed to delete group:", err);
        Utils.dispatchNotification(
          err.response?.data?.message || "Failed to delete group",
          "error",
          dispatch
        );
        setShowSettingsDropdown(false);
      }
    };

    const handleInviteClick = () => {
        setShowInviteModal(true);
    };

    const getMembershipButton = () => {
        const baseClasses = isMobile
            ? "flex-1 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm relative"
            : "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 relative";

        switch (membershipStatus) {
            case "member":
            case "admin":
                return (
                    <div className="relative">
                        <button
                            onClick={() =>
                                setShowMembershipDropdown(
                                    !showMembershipDropdown
                                )
                            }
                            className={`${baseClasses} bg-gray-200 text-primary-black `}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                />
                            </svg>
                            joined
                            <FaChevronDown size={14} />
                        </button>

                        {showMembershipDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <button
                                    onClick={() => {
                                        onLeaveGroup();
                                        setShowMembershipDropdown(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
                                >
                                    <FaUserMinus size={14} />
                                    Leave Group
                                </button>
                            </div>
                        )}
                    </div>
                );
            case "pending":
                return (
                    <button
                        onClick={onCancelRequest}
                        className={`${baseClasses} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`}
                    >
                        <FaClock size={isMobile ? 14 : 16} />
                        Pending
                    </button>
                );
            default:
                return (
                    <button
                        onClick={onJoinGroup}
                        className={`${baseClasses} bg-blue-500 text-white hover:bg-blue-600`}
                    >
                        <FaUserPlus size={isMobile ? 14 : 16} />
                        {group?.privacy?.whoCanJoin === "anyone"
                            ? "Join"
                            : "Request to Join"}
                    </button>
                );
        }
    };

    const getSettingsButton = () => {
        if (membershipStatus !== "admin") return null;

        const buttonClasses = isMobile
            ? "px-4 py-2 h-full  flex items-center gap-2 text-sm relative"
            : "px-4 py-2 h-full  flex items-center gap-2 relative";

        return (
            <div className="relative ">
                <button
                    onClick={() =>
                        setShowSettingsDropdown(!showSettingsDropdown)
                    }
                    className={buttonClasses}
                    aria-label="Group settings"
                >
                    <HiDotsVertical size={isMobile ? 20 : 24} />
                </button>

                {showSettingsDropdown && (
                    <div className="absolute top-full right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-300">
                        <button
                            onClick={handleEditGroup}
                            className="w-full duration-300 transition-all px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                        >
                            <FaEdit size={14} />
                            Edit Group
                        </button>
                        <button
                            onClick={handleDeleteGroup}
                            className="w-full duration-300 transition-all px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
                        >
                            <FaTrash size={14} />
                            Delete Group
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (isMobile) {
        return (
            <>
                <div className="space-y-3 w-full justify-between items-center">
                    {/* Primary Action Row */}
                    <div className="flex gap-2">
                        {getMembershipButton()}

                        {(membershipStatus === "member" ||
                            membershipStatus === "admin" ||
                            membershipStatus === "moderator") && (
                            <button
                                onClick={handleInviteClick}
                                className="px-4 py-2 border font-semibold bg-primary hover:bg-primary/50 transition-all duration-300 text-white rounded-lg flex items-center gap-1"
                                aria-label="Invite members"
                            >
                                <FaPlus size={14} />
                                Invite
                            </button>
                        )}
                        {/* Secondary Actions Row */}
                        <div className="flex gap-2 justify-center">
                            {getSettingsButton()}
                        </div>
                    </div>
                </div>

                {/* Invite Members Modal */}
                <InviteMembers
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    groupId={groupId}
                    groupName={group?.name || ""}
                />
            </>
        );
    }

    // Desktop layout
    return (
        <>
            <div className="flex gap-3">
                {(membershipStatus === "member" ||
                    membershipStatus === "admin" ||
                    membershipStatus === "moderator") && (
                    <button
                        onClick={handleInviteClick}
                        className="px-4 py-2 border font-semibold bg-primary hover:bg-primary/50 transition-all duration-300 text-white rounded-lg flex items-center gap-1"
                        aria-label="Invite members"
                    >
                        <FaPlus size={14} />
                        Invite
                    </button>
                )}

                {getMembershipButton()}
                {getSettingsButton()}
            </div>

            {/* Invite Members Modal */}
            <InviteMembers
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                groupId={groupId}
                groupName={group?.name || ""}
            />
        </>
    );
};

GroupActionButtons.propTypes = {
    group: PropTypes.object.isRequired,
    groupId: PropTypes.string.isRequired,
    membershipStatus: PropTypes.string.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
    onLeaveGroup: PropTypes.func.isRequired,
    onCancelRequest: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    setIsShowEditGroup: PropTypes.func,
};

export default GroupActionButtons;
