import { groupChatService } from "@services/api/chat/group-chat.service";
import { socketService } from "@services/socket/socket.service";
import { cloneDeep, findIndex, remove } from "lodash";
import { createSearchParams } from "react-router-dom";

export default class GroupChatUtils {
    static groupChatMessages = [];
    static activeGroups = [];
    static currentGroupId;

    static navigateToGroupChat(groupData, navigate) {
        const url = `/app/social/chat/messages?${createSearchParams({
            username: groupData?.name,
            id: groupData?._id,
            isGroup: true,
        })}`;
        navigate(url);
    }

    static async getInvitationsCount() {
        const invitationsCount =
            await groupChatService.getUserPendingInvitations();
        return invitationsCount.data.pendingGroups.length;
    }

    static joinGroupRoom(groupId, profile) {
        const userData = {
            groupId: groupId,
            userId: profile?._id,
            username: profile?.username,
        };
        socketService?.socket?.emit("join group room", userData);
    }

    static leaveGroupRoom(groupId, profile) {
        const userData = {
            groupId: groupId,
            userId: profile?._id,
            username: profile?.username,
        };
        socketService?.socket?.emit("leave group room", userData);
    }

    static emitGroupChatEvent(event, data) {
        socketService?.socket?.emit(event, data);
    }

    static emitGroupAction(actionType, data) {
        socketService?.socket?.emit("group action", { type: actionType, data });
    }

    static groupMessageData({
        groupId,
        groupName,
        message,
        isRead,
        gifUrl,
        selectedImage,
    }) {
        const messageData = {
            groupId,
            groupName,
            body: message.trim(),
            isRead,
            gifUrl,
            selectedImage,
            isGroupChat: true,
        };
        return messageData;
    }

    static socketIOGroupList(profile, groupList, setGroupList) {
        // Remove any existing listeners to prevent duplicates
        socketService?.socket?.off("group chat list");
        socketService?.socket?.off("group updated");
        socketService?.socket?.off("group member promoted");
        socketService?.socket?.off("group deleted");

        socketService?.socket?.on("group chat list", (data) => {
            // Check if user is a member of this group
            if (
                data.members &&
                data.members.some((member) => member.userId === profile?._id)
            ) {
                let groupIndex = findIndex(groupList, ["_id", data._id]);
                let updatedGroupList = cloneDeep(groupList);

                if (groupIndex > -1) {
                    // Replace existing group with updated data
                    updatedGroupList[groupIndex] = data;
                } else {
                    // Add new group to the beginning of the list
                    updatedGroupList = [data, ...updatedGroupList];
                }
                setGroupList(updatedGroupList);
            }
        });

        // Handle group updates with improved error checking
        socketService?.socket?.on("group updated", (data) => {
            if (!data || !data._id) return;

            if (
                data.members &&
                data.members.some((member) => member.userId === profile?._id)
            ) {
                let updatedGroupList = cloneDeep(groupList);
                let groupIndex = findIndex(updatedGroupList, ["_id", data._id]);

                if (groupIndex > -1) {
                    // Update existing group
                    updatedGroupList[groupIndex] = data;
                } else {
                    // Add as new group
                    updatedGroupList = [data, ...updatedGroupList];
                }
                setGroupList(updatedGroupList);
            } else {
                // User was removed from group, remove from list
                let updatedGroupList = cloneDeep(groupList);
                remove(updatedGroupList, (group) => group._id === data._id);
                setGroupList(updatedGroupList);
            }
        });

        // Handle group deletion with improved error handling
        socketService?.socket?.on("group deleted", (groupId) => {
            if (!groupId) return;

            let updatedGroupList = cloneDeep(groupList);
            remove(updatedGroupList, (group) => group._id === groupId);
            setGroupList(updatedGroupList);
        });
    }

    static socketIOGroupMessageReceived(
        groupMessages,
        groupId,
        setGroupMessages
    ) {
        groupMessages = cloneDeep(groupMessages);

        socketService?.socket?.on("group message received", (data) => {
            if (data.groupId === groupId) {
                GroupChatUtils.groupChatMessages.push(data);
                groupMessages = [...GroupChatUtils.groupChatMessages];
                setGroupMessages(groupMessages);
            }
        });
    }

    static socketIOGroupMessageReaction(
        groupMessages,
        groupId,
        setGroupMessages
    ) {
        socketService?.socket?.on("group message reaction", (data) => {
            if (data.groupId === groupId) {
                groupMessages = cloneDeep(groupMessages);
                const messageIndex = findIndex(
                    GroupChatUtils.groupChatMessages,
                    (msg) => msg._id === data._id
                );

                if (messageIndex > -1) {
                    GroupChatUtils.groupChatMessages[messageIndex] = data;
                    groupMessages = [...GroupChatUtils.groupChatMessages];
                    setGroupMessages(groupMessages);
                }
            }
        });
    }

    static getGroupChatUrlParams(groupData) {
        return {
            username: groupData.name || groupData.groupName,
            id: groupData._id || groupData.groupId,
            isGroup: true,
        };
    }

    static setActiveGroup(groupData, setSelectedGroup) {
        setSelectedGroup({ isLoading: false, group: groupData });
    }

    static userIsGroupAdmin(groupData, userId) {
        return (
            groupData && groupData.admins && groupData.admins.includes(userId)
        );
    }

    static userIsGroupMember(members, userId) {
        if (!Array.isArray(members) || !userId) return false;
        return members.some(
            (member) => member.userId === userId && member.state !== "pending"
        );
    }

    static async isValidMessageDisplay(groupID, userID) {
        if (!groupID || !userID) return false;

        const response = await groupChatService.checkGroupMember(
            groupID,
            userID
        );
        if (response) {
            return true;
        }
        return false;
    }

    static removeGroupSocketListeners() {
        const socket = socketService?.socket;
        if (socket) {
            // Remove all group-related socket listeners
            socket.off("group message received");
            socket.off("group message reaction");
            socket.off("group updated");
            socket.off("group chat list");
            socket.off("group member promoted");
            socket.off("group deleted");
            socket.off("group member removed");
            socket.off("group action");
        }
    }

    static handleGroupInvitation(groupId, accept = true) {
        if (accept) {
            return groupChatService.acceptGroupInvitation(groupId);
        } else {
            return groupChatService.declineGroupInvitation(groupId);
        }
    }

    static memberActions(groupId, memberId, action) {
        switch (action) {
            case "promote":
                return groupChatService.promoteToAdmin(groupId, memberId);
            case "remove":
                return groupChatService.removeMember(groupId, memberId);
            default:
                return null;
        }
    }
}
