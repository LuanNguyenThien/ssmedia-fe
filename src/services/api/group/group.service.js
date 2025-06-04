import axios from "@services/axios";

class GroupService {
  async createGroup(body) {
    const response = await axios.post("/group/create", body);
    return response;
  }

  
}

export const groupService = new GroupService();
