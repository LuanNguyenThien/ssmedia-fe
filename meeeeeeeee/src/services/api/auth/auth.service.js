import axios from '@services/axios';

class AuthService {
  async signUp(body) {
    const response = await axios.post('/signup', body);
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  }

  async signIn(body) {
    const response = await axios.post('/signin', body);
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  }

  async forgotPassword(email) {
    const response = await axios.post('/forgot-password', { email });
    return response;
  }

  async resetPassword(token, body) {
    const response = await axios.post(`/reset-password/${token}`, body);
    return response;
  }
}

export const authService = new AuthService();
