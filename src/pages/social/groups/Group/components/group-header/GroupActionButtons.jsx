import PropTypes from "prop-types";
import { useRef, useState } from "react";
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
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";
const GroupActionButtons = ({
    group,
    groupId,
    membershipStatus,
    onJoinGroup,
    onLeaveGroup,
    onCancelRequest,
    isMobile = false,
    setIsShowEditGroup = () => {},
    isAdmin,
}) => {
    const memberShipRef = useRef(null);
    const settingsRef = useRef(null);

    const [showMembershipDropdown, setShowMembershipDropdown] =
        useDetectOutsideClick(memberShipRef, false);
    const [showSettingsDropdown, setShowSettingsDropdown] =
        useDetectOutsideClick(settingsRef, false);
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
            ? "flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm relative hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
            : "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 relative hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";
        console.log(membershipStatus);
        switch (membershipStatus) {
            case "member":
            case "admin":
                return (
                    <div className="relative">
                        <button
                            ref={memberShipRef}
                            onClick={() =>
                                setShowMembershipDropdown(
                                    !showMembershipDropdown
                                )
                            }
                            className={`${baseClasses} bg-gray-200 text-primary-black/70 hover:bg-gray-300 focus:ring-primary`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 transition-colors duration-200"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                />
                            </svg>
                            Joined
                            <FaChevronDown
                                size={14}
                                className="transition-transform duration-200"
                            />
                        </button>

                        {showMembershipDropdown && (
                            <div
                                className={`
                                    absolute top-full left-0 mt-2 w-48 
                                    bg-white border border-gray-200 rounded-lg shadow-lg z-50 
                                    transform transition-all duration-200 ease-in-out
                                    ${
                                        showMembershipDropdown
                                            ? "scale-100 opacity-100 visible"
                                            : "scale-95 opacity-0 invisible"
                                    }
                                    font-medium
                                `}
                                style={{
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                }}
                            >
                                <div className="py-2">
                                    <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide font-semibold border-b border-gray-100">
                                        Membership
                                    </div>
                                    <button
                                        onClick={() => {
                                            onLeaveGroup();
                                            setShowMembershipDropdown(false);
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-red-500 hover:text-white flex items-center gap-3 text-red-600 transition-all duration-200 group focus:outline-none focus:bg-red-500 focus:text-white"
                                    >
                                        <FaUserMinus
                                            size={14}
                                            className="text-red-500 group-hover:text-white group-focus:text-white transition-colors duration-200"
                                        />
                                        <span className="font-medium">
                                            Leave Group
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "pending_admin":
                return (
                    <button
                        onClick={onCancelRequest}
                        className={`${baseClasses} bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500`}
                    >
                        <FaClock
                            size={isMobile ? 14 : 16}
                            className="transition-colors duration-200"
                        />
                        Pending
                    </button>
                );
            default:
                return (
                    <button
                        onClick={onJoinGroup}
                        className={`${baseClasses} bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500`}
                    >
                        <FaUserPlus
                            size={isMobile ? 14 : 16}
                            className="transition-colors duration-200"
                        />
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
            ? "w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            : "w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

        return (
            <div className="relative">
                <button
                    title="Settings"
                    ref={settingsRef}
                    onClick={() =>
                        setShowSettingsDropdown(!showSettingsDropdown)
                    }
                    className={buttonClasses}
                    aria-label="Group settings"
                >
                    <FaCog
                        className="text-primary-black/70 transition-colors duration-200"
                        size={isMobile ? 18 : 16}
                    />
                </button>

                {showSettingsDropdown && (
                    <div
                        className={`
                            absolute top-full right-0 mt-2 w-48 
                            bg-white border border-gray-200 rounded-lg shadow-lg z-50 
                            transform transition-all duration-200 ease-in-out
                            ${
                                showSettingsDropdown
                                    ? "scale-100 opacity-100 visible"
                                    : "scale-95 opacity-0 invisible"
                            }
                            font-medium
                        `}
                        style={{
                            boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}
                    >
                        <div className="py-2">
                            <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide font-semibold border-b border-gray-100">
                                Actions
                            </div>
                            <button
                                onClick={handleEditGroup}
                                className="w-full px-4 py-3 text-left hover:bg-primary hover:text-white flex items-center gap-3 text-gray-700 transition-all duration-200 group focus:outline-none focus:bg-primary focus:text-white"
                            >
                                <FaEdit
                                    size={14}
                                    className="text-primary group-hover:text-white group-focus:text-white transition-colors duration-200"
                                />
                                <span className="font-medium">Edit Group</span>
                            </button>
                            <button
                                onClick={handleDeleteGroup}
                                className="w-full px-4 py-3 text-left hover:bg-red-500 hover:text-white flex items-center gap-3 text-red-600 transition-all duration-200 group focus:outline-none focus:bg-red-500 focus:text-white"
                            >
                                <FaTrash
                                    size={14}
                                    className="text-red-500 group-hover:text-white group-focus:text-white transition-colors duration-200"
                                />
                                <span className="font-medium">
                                    Delete Group
                                </span>
                            </button>
                        </div>
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
                            membershipStatus === "admin") && (
                            <button
                                onClick={handleInviteClick}
                                className="px-4 py-2 border font-semibold bg-primary hover:bg-primary/50 transition-all duration-300 text-white rounded-lg flex items-center gap-2"
                                aria-label="Invite members"
                            >
                                <FaPlus size={14} />
                                Invite
                            </button>
                        )}
                        {/* Secondary Actions Row */}
                        <div className="flex gap-2 justify-center">
                            {isAdmin && getSettingsButton()}
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
                        className="px-4 py-2 border font-semibold bg-primary hover:bg-primary/50 transition-all duration-300 text-white rounded-lg flex items-center gap-2"
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
                group={group}
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
