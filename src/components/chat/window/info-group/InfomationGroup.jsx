import { useState, useEffect } from "react";
import { FaTimes, FaChevronDown } from "react-icons/fa";
import { DynamicSVG } from "@components/sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";
import { Utils } from "@services/utils/utils.service";
import EditGroupInfo from "../../group/EditGroupInfo";
import { useDispatch } from "react-redux";
import AddMember from "../../group/AddMember";
import { groupChatService } from "@/services/api/chat/group-chat.service";
import ConfirmModal from "@/components/confirm-modal/ConfirmModal";
import MemberCard from "./MemberCard";
import GroupChatUtils from "@/services/utils/group-chat-utils.service";

const InformationGroup = ({ ref, info, onClose, currentUser, onSuccess }) => {
    const dispatch = useDispatch();
    const [showMembers, setShowMembers] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAddMember, setIsAddMember] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [selectedMember, setSelectedMember] = useState(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [showPromoteConfirm, setShowPromoteConfirm] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Check if current user is admin
    // const isAdmin = currentUser.username === info.members[0].username;
    const isAdmin =
        info.members.find((member) => {
            return member.userId === currentUser._id;
        }).role === "admin";

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleEditGroupInfoSuccess = () => {
        Utils.dispatchNotification(
            "Group information updated successfully!",
            "success",
            dispatch
        );
        onSuccess();
    };

    const handleAddMemberSuccess = () => {
        setIsAddMember(false); // Close the AddMember component first
        Utils.dispatchNotification(
            "Members added successfully!",
            "success",
            dispatch
        );
        onSuccess();
    };

    //handle leave group
    const handleLeaveGroup = () => {
        setShowLeaveConfirm(true);
    };
    //handle promote member
    const handlePromoteMember = (user) => {
        if (user) {
            setSelectedMember(user);
        }
        setShowPromoteConfirm(true);
    };

    //handle delete group
    const handleDeleteGroup = () => {
        setShowDeleteConfirm(true);
    };

    const handleRemoveMember = (user) => {
        if (user) {
            setSelectedMember(user);
        }
        setShowRemoveConfirm(true);
    };

    const confirmPromoteMember = async () => {
        try {
            await groupChatService.promoteToAdmin(
                info._id,
                selectedMember.userId
            );
            // Emit socket event for real-time update
            GroupChatUtils.emitGroupAction("PROMOTE_ADMIN", {
                groupId: info._id,
                userId: selectedMember.userId,
                username: selectedMember.username,
            });
            Utils.dispatchNotification(
                "Member promoted successfully!",
                "success",
                dispatch
            );
            onSuccess();
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error promoting member",
                "error",
                dispatch
            );
        }
        setShowPromoteConfirm(false);
    };
    const confirmRemoveMember = async () => {
        try {
            await groupChatService.removeMember(
                info._id,
                selectedMember.userId
            );
            // Emit socket event for real-time update
            GroupChatUtils.emitGroupAction("REMOVE_MEMBER", {
                groupId: info._id,
                userId: selectedMember.userId,
                username: selectedMember.username,
            });
            Utils.dispatchNotification(
                "Member removed successfully!",
                "success",
                dispatch
            );
            onSuccess();
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error removing member",
                "error",
                dispatch
            );
        }
        setShowRemoveConfirm(false);
    };
    const confirmLeaveGroup = async () => {
        try {
            await groupChatService.leaveGroup(info._id);
            // Emit socket event for real-time update
            GroupChatUtils.emitGroupAction("LEAVE_GROUP", {
                groupId: info._id,
                userId: currentUser._id,
                username: currentUser.username,
            });
            Utils.dispatchNotification(
                "You have left the group successfully!",
                "success",
                dispatch
            );
            setShowLeaveConfirm(false);
            onSuccess();
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error leaving group",
                "error",
                dispatch
            );
            setShowLeaveConfirm(false);
        }
    };
    const confirmDeleteGroup = async () => {
        try {
            await groupChatService.deleteGroup(info._id);
            // Emit socket event for real-time update
            GroupChatUtils.emitGroupAction("DELETE_GROUP", {
                groupId: info._id,
            });
            Utils.dispatchNotification(
                "Group deleted successfully!",
                "success",
                dispatch
            );
            setShowDeleteConfirm(false);
            onSuccess();
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Error deleting group",
                "error",
                dispatch
            );
            setShowDeleteConfirm(false);
        }
    };

    const stateCss = "text-primary-black font-semibold text-sm";
    const renderState = (value) => {
        switch (value) {
            case "admin":
                return <span className={stateCss}>Admin</span>;
            case "member":
                return <span className={stateCss}>Member</span>;
            default:
                return <span className={stateCss}>Invited</span>;
        }
    };

    return (
        <>
            {showRemoveConfirm && (
                <ConfirmModal
                    title={`Remove this member?`}
                    subTitle={`Are you sure you want to remove ${selectedMember.username} from this group?`}
                    handleConfirm={confirmRemoveMember}
                    handleCancel={() => setShowRemoveConfirm(false)}
                    labelButtonConfirm="Remove"
                    classNameButtonConfirm="bg-red-500 hover:bg-red-600"
                    icon="warning"
                />
            )}
            {showPromoteConfirm && (
                <ConfirmModal
                    title={`Promote this member to admin`}
                    subTitle={`Are you sure you want to promote ${selectedMember.username} to admin?`}
                    handleConfirm={confirmPromoteMember}
                    handleCancel={() => setShowPromoteConfirm(false)}
                    labelButtonConfirm="Promote"
                    icon="info"
                />
            )}
            {/* Confirm Leave Group Modal */}
            {showLeaveConfirm && (
                <ConfirmModal
                    title="Leave Group"
                    subTitle="Are you sure you want to leave this group? You will need to be invited back to join again."
                    handleConfirm={confirmLeaveGroup}
                    handleCancel={() => setShowLeaveConfirm(false)}
                    labelButtonConfirm="Leave"
                    labelButtonCancel="Cancel"
                    classNameButtonConfirm="bg-red-500 hover:bg-red-600"
                    icon="warning"
                />
            )}

            {/* Confirm Delete Group Modal */}
            {showDeleteConfirm && (
                <ConfirmModal
                    title="Delete Group"
                    subTitle="Are you sure you want to delete this group? This action cannot be undone and all messages will be permanently lost."
                    handleConfirm={confirmDeleteGroup}
                    handleCancel={() => setShowDeleteConfirm(false)}
                    labelButtonConfirm="Delete"
                    labelButtonCancel="Cancel"
                    classNameButtonConfirm="bg-red-500 hover:bg-red-600"
                    icon="delete"
                />
            )}
            <div
                ref={ref}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className={`absolute top-0 right-0 h-full w-full lg:w-1/2  py-2 px-4 bg-white shadow-lg z-10 flex flex-col border-l border-gray-200 transition-transform duration-300 ease-in-out ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {isEditing && (
                    <EditGroupInfo
                        groupInfo={info}
                        onClose={() => setIsEditing(false)}
                        onSuccess={handleEditGroupInfoSuccess}
                    />
                )}

                {isAddMember && (
                    <AddMember
                        existingMembers={info.members}
                        groupId={info._id}
                        onClose={() => setIsAddMember(false)}
                        onSuccess={handleAddMemberSuccess} // Pass the function reference directly
                    />
                )}

                {/* Header section */}
                <div className="sticky top-0 bg-white p-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Group Info</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Divider line */}
                <div className="w-full h-auto flex justify-center">
                    <div className="h-[1px] w-2/3 bg-gray-200" />
                </div>

                {/* Group details */}
                <div className="overflow-y-auto flex-1 scrollbar-hide relative">
                    {isAdmin && (
                        <div className="absolute size-auto flex items-center gap-2 top-4 right-4 cursor-pointer ">
                            <div
                                onClick={() => setIsAddMember(true)}
                                className="size-5 hover:text-primary"
                            >
                                <DynamicSVG
                                    svgData={icons.addmember}
                                    className="size-5"
                                />
                            </div>
                            <div
                                onClick={() => setIsEditing(true)}
                                className="size-5 hover:text-primary"
                            >
                                <DynamicSVG
                                    svgData={icons.setting}
                                    className="size-5"
                                />
                            </div>
                        </div>
                    )}
                    <div className="p-4 flex flex-col items-center">
                        <div className="relative mb-3">
                            {info.profilePicture ? (
                                <img
                                    src={info.profilePicture}
                                    alt={info.name}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl">
                                    {info.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <h3 className="text-xl font-semibold text-center">
                            {info.name}
                        </h3>
                        {info.description && (
                            <p className="text-gray-700 mt-4 text-center">
                                {info.description}
                            </p>
                        )}
                    </div>

                    {/* Members section */}
                    <div className="px-4 pb-4">
                        <div
                            className="flex justify-between items-center py-2 cursor-pointer"
                            onClick={() => setShowMembers(!showMembers)}
                        >
                            <h4 className="font-medium flex items-center gap-2">
                                <DynamicSVG
                                    svgData={icons.user}
                                    className="size-5"
                                />
                                Members ({info.members?.length || 0})
                            </h4>
                            <FaChevronDown
                                className={`transition-transform ${
                                    showMembers ? "rotate-180" : ""
                                }`}
                            />
                        </div>

                        {showMembers && (
                            <div className="space-y-2 overflow-y-scroll max-h-[200px]">
                                {info.members?.map((member) => (
                                    <MemberCard
                                        key={member._id}
                                        groupId={info._id}
                                        member={member}
                                        renderState={renderState}
                                        isAdmin={isAdmin}
                                        handlePromoteMember={
                                            handlePromoteMember
                                        }
                                        handleRemoveMember={handleRemoveMember}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-full h-auto flex justify-center">
                        <div className="h-[1px] w-2/3 bg-gray-200" />
                    </div>

                    {/* Leave group option */}
                    <div className="p-4 mt-auto  self-end">
                        <button
                            onClick={handleLeaveGroup}
                            className="w-full h-auto py-2 px-3 rounded-lg text-red-500 hover:bg-red-50 flex justify-center items-center gap-2"
                        >
                            <DynamicSVG
                                svgData={icons.leave}
                                className="size-5"
                            />
                            Leave this group
                        </button>
                        {isAdmin && (
                            <button
                                onClick={handleDeleteGroup}
                                className="w-full h-auto py-2 px-3 rounded-lg text-red-500 hover:bg-red-50 flex justify-center items-center gap-2"
                            >
                                <DynamicSVG
                                    svgData={icons.remove}
                                    className="size-5"
                                />
                                Delete this group
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default InformationGroup;
