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

    // Future implementations for these endpoints:
    // async sendGroupMessage(body) {
    //     const response = await axios.post("/group/message", body);
    //     return response;
    // }
    
    // async addGroupMembers(body) {
    //     const response = await axios.put("/group/add-members", body);
    //     return response;
    // }
    
    // async removeGroupMembers(body) {
    //     const response = await axios.put("/group/remove-members", body);
    //     return response;
    // }
    
    // async getUserGroups() {
    //     const response = await axios.get("/groups");
    //     return response;
    // }
}

export const groupChatService = new GroupChatService();