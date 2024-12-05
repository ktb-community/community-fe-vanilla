import API from '../../api/api.js';
import { RES_STATUS } from '../../utils/const.js';
import { renderBoardComment } from './boardDetailRenderer.js';

/* 댓글 추가 (낙관적 업데이트) */
export const handleAddComment = (userId, boardId) => {
  const commentAreaElement = document.getElementById('board-comments-add-area');
  const commentAddBtnElement = document.getElementById('board-comments-add-btn');
  const commentCntElement = document.getElementById('board-comment-cnt');

  const user = JSON.parse(localStorage.getItem('user'));
  const comment = commentAreaElement.value;

  // 요청이 성공되었다고 가정하고 먼저 댓글 렌더링
  const optimisticComment = {
    commentId: `temp-${Date.now()}`,
    content: comment,
    createdAt: '방금 전',
    writerId: user.id,
    writerNickname: user.nickname,
    writerProfileImg: user.profile,
  };

  // 선 렌더링 이후 버튼 상태 초기화
  renderBoardComment(optimisticComment, user.id);

  commentAreaElement.value = '';
  commentAddBtnElement.style.backgroundColor = '#ACA0EB';
  commentAddBtnElement.style.cursor = 'not-allowed';
  commentAddBtnElement.disabled = true;
  commentCntElement.innerText = (parseInt(commentCntElement.innerText, 10) + 1).toString();

  // 댓글 추가 요청 후 업데이트
  const newCommentElement = document.getElementById(optimisticComment.commentId);
  const commentTimeElement = newCommentElement.querySelector('.board-comments-info-time');

  API.addBoardComment(comment, userId, boardId)
    .then(json => {
      // 성공했으면, 댓글 등록 시간 업데이트
      if (json.status === RES_STATUS.SUCCESS && commentTimeElement) {
        commentTimeElement.innerHTML = json.data.createdAt;
      }
    })
    .catch(err => {
      console.error(err.message);

      // 실패시 UI에서 제거
      if (newCommentElement) {
        newCommentElement.remove();
        commentCntElement.innerText = (parseInt(commentCntElement.innerText, 10) - 1).toString();
      }

      alert('댓글을 추가하는 중 에러가 발생하였습니다.');
    });
};

/* 댓글 수정 (낙관적 업데이트) */
export const handleEditComment = () => {};

/* 댓글 삭제 */
export const handleDeleteComment = (commentId, userId, boardId) => {
  const modalElement = document.getElementById('comment-modal');
  const commentCntElement = document.getElementById('board-comment-cnt');
  const comments = Array.from(document.querySelectorAll('.board-comments-info-container'));
  const commentIndex = comments.findIndex(comment => comment.getAttribute('id') === commentId);

  if (commentIndex !== -1) {
    comments[commentIndex].remove();
    modalElement.close();
    commentCntElement.innerText = (parseInt(commentCntElement.innerText, 10) - 1).toString();
  }

  API.deleteBoardComment(commentId, userId, boardId).catch(err => {
    console.error(err.message);

    // 댓글 카운트 개수 복구
    commentCntElement.innerText = (parseInt(commentCntElement.innerText, 10) + 1).toString();

    // 삭제된 댓글을 복구하여 DOM에 다시 추가
    const parentElement = document.querySelector('.board-comments-container'); // 댓글들이 포함된 부모 요소
    if (parentElement && removedComment) {
      parentElement.insertBefore(removedComment, parentElement.children[commentIndex]);
    }
  });
};
