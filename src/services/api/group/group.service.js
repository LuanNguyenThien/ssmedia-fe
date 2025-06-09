import axios from "@services/axios";

class GroupService {
  async createGroup(body) {
    const response = await axios.post("/group/create", body);
    return response;
  }

  async getGroupByUserId(userId) {
    const response = await axios.get(`/group/user-group/${userId}`);
    return response;
  }

  async getGroupByinvitations() {
    const response = await axios.get(`/group/invitations`);
    return response;
  }

  async getGroupByGroupId(groupId) {
    const response = await axios.get(`/group/${groupId}`);
    return response;
  }

  async getGroupNotJoinByGroupId() {
    const response = await axios.get(`/group/not-joined`);
    return response;
  }

  async acceptGroupInvitation(groupId) {
    const response = await axios.put(`/group/invitation/accept/${groupId}`);
    return response;
  }

  async declineGroupInvitation(groupId) {
    const response = await axios.put(`/group/invitation/decline/${groupId}`);
    return response;
  }

  async joinGroup(groupId) {
    const response = await axios.post(`/group/join/${groupId}`);
    return response;
  }

  async getpendinguser(groupId) {
    const response = await axios.get(`/group/pending-admin/${groupId}`);
    return response;
  }

  async approveMemberByAdmin(groupId, userId) {
    const response = await axios.put(
      `/group/approve-member/${groupId}/${userId}`
    );
    return response;
  }

  async rejectMemberByAdmin(groupId, userId) {
    const response = await axios.put(
      `/group/reject-member/${groupId}/${userId}`
    );
    return response;
  }

  async leaveGroup(groupId) {
    const response = await axios.put(`/group/leave/${groupId}`);
    return response;
  }

  async updateGroup(groupId, body) {
    const response = await axios.put(`/group/${groupId}`, body);
    return response;
  }

  async deleteGroup(groupId) {
    const response = await axios.delete(`/group/${groupId}`);
    return response;
  }

  async inviteUserToGroup(groupId, members) {
    const response = await axios.put(`/group/add-members/${groupId}`, {
      members,
    });
    return response;
  }

  async removeMember(groupId, members) {
    const response = await axios.put(`/group/remove-members/${groupId}`, {
      members,
    });
    return response;
  }
}

export const groupService = new GroupService();
