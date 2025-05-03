import axios from '@services/axios';

class UserService {
  async getUserSuggestions() {
    const response = await axios.get("/user/profile/user/suggestions");
    return response;
  }

  async logoutUser() {
    const response = await axios.get("/signout");
    return response;
  }

  async checkCurrentUser() {
    const response = await axios.get("/currentuser");
    return response;
  }

  async getAllUsers(page) {
    const response = await axios.get(`/user/all/${page}`);
    return response;
  }

  async getUsersToday() {
    const response = await axios.get(`/admin/newusertoday`);
    return response;
  }

  async GetStatisticUser() {
    const response = await axios.get(`/admin/statistic/user`);
    return response;
  }

  async GetStatisticUserperyear() {
    const response = await axios.get(`/admin/statistic/userperyear`);
    return response;
  }

  async GetStatisticUserperMonth() {
    const response = await axios.get(`/admin/statistic/userpermonth`);
    return response;
  }

  async getAllUsersAdminRole(page) {
    const response = await axios.get(`/admin/users/all/${page}`);
    return response;
  }
  async getAllUsersReportAdminRole(page) {
    const response = await axios.get(`/reportprofile/${page}`);
    return response;
  }
  async getAllBanUsersAdminRole(page) {
    const response = await axios.get(`/admin/banuser/${page}`);
    return response;
  }

  async getAllAppeal(page) {
    const response = await axios.get(`/admin/appeal/${page}`);
    return response;
  }

  async searchUsers(query) {
    const response = await axios.get(`/user/profile/search/${query}`);
    return response;
  }

  async getUserProfileByUserId(userId) {
    const response = await axios.get(`/user/profile/${userId}`);
    return response;
  }

  async getUserProfileByUsername(username, userId, uId) {
    const response = await axios.get(
      `/user/profile/posts/${username}/${userId}/${uId}`
    );
    return response;
  }

  async GetBanInfo(userId) {
    const response = await axios.get(`/user/banuser/${userId}`);
    return response;
  }

  async BanUser(body) {
    const response = await axios.post(`/admin/banuser`, body);
    return response;
  }

  async UnBanUser(body) {
    const response = await axios.post(`/admin/unbanuser`, body);
    return response;
  }

  async Appeal(body) {
    const response = await axios.post(`/appeal`, body);
    return response;
  }

  async ChangeStatus(body) {
    const response = await axios.put(`/admin/reportprofile/status`, body);
    return response;
  }

  async ChangeStatusAppeal(body) {
    const response = await axios.put(`/admin/appeal/status`, body);
    return response;
  }

  async changePassword(body) {
    const response = await axios.put("/user/profile/change-password", body);
    return response;
  }

  async updateNotificationSettings(settings) {
    const response = await axios.put("/user/profile/settings", settings);
    return response;
  }

  async updateBasicInfo(info) {
    const response = await axios.put("/user/profile/basic-info", info);
    return response;
  }

  async updateSocialLinks(info) {
    const response = await axios.put("/user/profile/social-links", info);
    return response;
  }
}

export const userService = new UserService();
