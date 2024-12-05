const API = {
  BASE_URL: 'http://localhost:8000/api/v1',

  async fetch(endpoint, options = {}) {
    const res = await fetch(`${this.BASE_URL}${endpoint}`, options);
    if (res.ok) return res.json();
    else console.error(`Error! ${this.BASE_URL}${endpoint} ${res.status}`);
  },

  /* 게시글 관련 API */
  fetchBoardDetail(boardId) {
    return this.fetch(`/boards/${boardId}`);
  },

  fetchBoardList(offset, limit) {
    return this.fetch(`/boards?offset=${offset}&limit=${limit}`);
  },

  incrementBoardViewCount(boardId) {
    fetch(`http://localhost:8000/api/v1/boards/${boardId}/views`, { method: 'POST' });
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

  modifyBoardComment(commentId, userId, boardId) {},

  deleteBoardComment(commentId, userId, boardId) {},
};

export default API;
