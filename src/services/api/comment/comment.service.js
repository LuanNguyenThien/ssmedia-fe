import axios from '@services/axios';

class CommentService {
  async getPostComments(postId) {
    const response = await axios.get(`/post/comments/${postId}`);
    return response;
  }

  async getPostCommentsNames(postId) {
    const response = await axios.get(`/post/commentsnames/${postId}`);
    return response;
  }

  async getSingleComment(postId, commentId) {
    const response = await axios.get(`/post/single/comment/${postId}/${commentId}`);
    return response;
  }
  
  async getUserReaction(commentId) {
    const response = await axios.get(`/post/comment/reaction/${commentId}`);
    return response;
  }

  async addComment(body) {
    const response = await axios.post('/post/comment', body);
    return response;
  }

  async addReaction(body) {
    const response = await axios.post('/post/comment/reaction', body);
    return response;
  }
  
  async deleteComment(commentId) {
    const response = await axios.delete(`/post/comment/${commentId}`);
    return response;
  }
}

export const commentService = new CommentService(); 