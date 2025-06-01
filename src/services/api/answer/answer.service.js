import axios from '@services/axios';

class AnswerService {
  async createAnswer(body) {
    const response = await axios.post('/answer', body);
    return response;
  }

//   async createAnswerWithImage(body) {
//     const response = await axios.post('/answer/image', body);
//     return response;
//   }

  async getAnswersForQuestion(questionId, page = 1) {
    const response = await axios.get(`/question/${questionId}/answers?page=${page}`);
    return response;
  }

  async getAnswer(answerId) {
    const response = await axios.get(`/answers/${answerId}`);
    return response;
  }

  async getUserAnswers(userId, page = 1) {
    const response = await axios.get(`/user/${userId}/answers?page=${page}`);
    return response;
  }
}

export const answerService = new AnswerService();