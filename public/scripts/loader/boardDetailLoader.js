import API from '../../api/api.js';
import { renderBoardDetail, renderBoardComments, renderBoardCommentArea, renderCommentModal } from '../render/boardDetailRenderer.js';

document.addEventListener('DOMContentLoaded', async () => {
  // url 쿼리 파라미터에서 게시글 id 가져오기
  const url = new URL(window.location.href);
  const segments = url.pathname.split('/');
  const boardId = parseInt(segments[2], 10) || null;
  const userId = JSON.parse(localStorage.getItem('user')).id;

  if (!boardId) {
    alert('비정상적인 접근입니다.');
    window.location.href = '/boards';
    return;
  }

  try {
    // 데이터 가져오기
    const { data: boardDetail } = await API.fetchBoardDetail(boardId);
    const { data: boardComments } = await API.fetchBoardComments(boardId);
    const { data: checkBoardLike } = await API.checkBoardLike(userId, boardId);

    // 초기 데이터 렌더링
    renderBoardDetail(boardDetail, userId, checkBoardLike || false);
    renderBoardCommentArea(userId, boardId);
    renderBoardComments(boardComments, userId, boardId);
    renderCommentModal(userId, boardId);

    // 조회수 증가 (비동기 호출)
    API.incrementBoardViewCount(boardId);
  } catch (err) {
    console.error(err.message);
  }
});
