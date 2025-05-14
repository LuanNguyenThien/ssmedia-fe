import axios from "@services/axios";

class GroupChatService {
    async createGroupChat(body) {
        const response = await axios.post("/group-chat/create", body);
        return response;
    }

    async getGroupChatById(groupId) {
        const response = await axios.get(`/group-chat/${groupId}`);
        return response;
    }
    // Invitation Management
    async getUserPendingInvitations() {
        const response = await axios.get("/group-chat/invitations");
        return response;
    }

    async acceptGroupInvitation(groupId) {
        const response = await axios.put(`/group-chat/invitation/accept/${groupId}`);
        return response;
    }

    async declineGroupInvitation(groupId) {
        const response = await axios.put(`/group-chat/invitation/decline/${groupId}`);
        return response;
    }

    async leaveGroup(groupId) {
        const response = await axios.put(`/group-chat/leave/${groupId}`);
        return response;
    }

    // User Groups
    async getUserGroups(userId) {
        const response = await axios.get(`/group-chat/user-group/${userId}`);
        return response;
    }

    // Group Management
    async updateGroupInfo(groupId, body) {
        const response = await axios.put(`/group-chat/${groupId}`, body);
        return response;
    }

    async addMembers(groupId, body) {
        const response = await axios.put(`/group-chat/add-members/${groupId}`, body);
        return response;
    }

    async promoteToAdmin(groupId, memberId) {
        const response = await axios.put(`/group-chat/promote/${groupId}/${memberId}`);
        return response;
    }

    async removeMember(groupId, memberId) {
        const response = await axios.delete(`/group-chat/remove-members/${groupId}/${memberId}`);
        return response;
    }

    async deleteGroup(groupId) {
        const response = await axios.delete(`/group-chat/${groupId}`);
        return response;
    }

    // Messages will be implemented in a separate service if needed, but keeping the placeholder here
    async sendGroupMessage(body) {
        const response = await axios.post("/group/message", body);
        return response;
    }

    async checkGroupMember(groupId, memberId) {
        const response = await axios.get(`/group-chat/check-member/${groupId}/${memberId}`);
        return response;
    }
}

export const groupChatService = new GroupChatService();