const API = {
  BASE_URL: 'http://localhost:8000/api/v1',

  async fetch(endpoint, options = {}) {
    const res = await fetch(`${this.BASE_URL}${endpoint}`, options);
    if (res.ok) return res.json();
    else return Promise.reject(res);
  },

  /* 게시글 관련 API */
  fetchBoardDetail(boardId) {
    return this.fetch(`/boards/${boardId}`);
  },

  fetchBoardList(offset, limit) {
    return this.fetch(`/boards?offset=${offset}&limit=${limit}`);
  },

  incrementBoardViewCount(boardId) {
    return fetch(`http://localhost:8000/api/v1/boards/${boardId}/views`, { method: 'POST' });
  },

  checkBoardLike(userId, boardId) {
    return this.fetch(`/boards/${boardId}/likes/${userId}`);
  },

  toggleBoardLike(userId, boardId) {
    return this.fetch(`/boards/${boardId}/likes/${userId}`, { method: 'POST' });
  },

  fetchBoardComments(boardId) {
    return this.fetch(`/boards/${boardId}/comments`, { method: 'GET' });
  },

  addBoardComment(content, userId, boardId) {
    return this.fetch(`/boards/${boardId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, userId }),
    });
  },

  modifyBoardComment(commentId, userId, boardId, comment) {
    return this.fetch(`/boards/${boardId}/comments`, {
      method: 'PATCH',
      body: JSON.stringify({ userId, commentId, comment }),
      headers: { 'Content-Type': 'application/json' },
    });
  },

  deleteBoardComment(commentId, userId, boardId) {
    return this.fetch(`/boards/${boardId}/comments`, {
      method: 'DELETE',
      body: JSON.stringify({ userId, commentId }),
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

export default API;
