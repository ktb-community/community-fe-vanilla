import { renderBoardEdit } from '../render/boardEditRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  // url 쿼리 파라미터에서 게시글 id 가져오기
  const url = new URL(window.location.href);
  const segments = url.pathname.split('/');
  const boardId = parseInt(segments[2], 10) || null;
  const userId = JSON.parse(localStorage.getItem('user')).id || null;
  const user = JSON.parse(localStorage.getItem('user'));

  if (!boardId || !userId) {
    alert('비정상적인 접근 시도입니다.');
    window.history.back();
  }

  if (!user) {
    alert('로그인 세션이 만료되었습니다.');
    window.location.href = `/auth/login`;
  }

  try {
    renderBoardEdit(userId, boardId);
  } catch (err) {
    console.error(err.message);
  }
});
