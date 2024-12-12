const API = {
  BASE_URL: 'http://localhost:8000/api/v1',

  async fetch(endpoint, options = {}) {
    const res = await fetch(`${this.BASE_URL}${endpoint}`, options);
    if (res.ok) return res.json();
    else return Promise.reject(res);
  },

  /* 게시글 관련 API */
  fetchBoardDetail(boardId) {
    return this.fetch(`/boards/${boardId}`, {
      credentials: 'include',
    });
  },

  fetchBoardList(offset, limit) {
    return this.fetch(`/boards?offset=${offset}&limit=${limit}`, {
      credentials: 'include',
    });
  },

  addBoard(formData) {
    return this.fetch(`/boards`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  },

  editBoard(formData, boardId) {
    return this.fetch(`/boards/${boardId}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
  },

  deleteBoard(userId, boardId) {
    return this.fetch(`/boards/${boardId}`, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' },
    });
  },

  incrementBoardViewCount(boardId) {
    return fetch(`http://localhost:8000/api/v1/boards/${boardId}/views`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  checkBoardLike(userId, boardId) {
    return this.fetch(`/boards/${boardId}/likes/${userId}`, {
      credentials: 'include',
    });
  },

  toggleBoardLike(userId, boardId) {
    return this.fetch(`/boards/${boardId}/likes/${userId}`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  fetchBoardComments(boardId) {
    return this.fetch(`/boards/${boardId}/comments`, {
      method: 'GET',
      credentials: 'include',
    });
  },

  addBoardComment(content, userId, boardId) {
    return this.fetch(`/boards/${boardId}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, userId }),
    });
  },

  modifyBoardComment(commentId, userId, boardId, comment) {
    return this.fetch(`/boards/${boardId}/comments`, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({ userId, commentId, comment }),
      headers: { 'Content-Type': 'application/json' },
    });
  },

  deleteBoardComment(commentId, userId, boardId) {
    return this.fetch(`/boards/${boardId}/comments`, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({ userId, commentId }),
      headers: { 'Content-Type': 'application/json' },
    });
  },

  sendLogout() {
    return this.fetch(`/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },
};

export default API;
