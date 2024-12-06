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
  renderBoardComment(optimisticComment, user.id, boardId);

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
        const newCommentContainer = document.getElementById('board-comments-container').lastElementChild;
        if (newCommentContainer) {
          newCommentContainer.setAttribute('id', json.commentId);
        }
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
export const handleEditComment = (btnGroupContainer, commentId, boardId, userId) => {
  // 기존 버튼 숨기기
  const editBtnElement = btnGroupContainer.children[0];
  const deleteBtnElement = btnGroupContainer.children[1];
  editBtnElement.remove();
  deleteBtnElement.remove();

  // 댓글 내용 가져오기
  const commentInfoContainer = btnGroupContainer.parentNode;
  const commentTotalContainer = commentInfoContainer.parentNode;
  const commentContainer = commentTotalContainer.querySelector('.board-comments-comment-container');
  const commentParagraph = commentContainer.querySelector('p');
  const originalComment = commentParagraph.textContent;

  // input 창 생성 및 기존 댓글로 내용 채우기
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.value = originalComment;
  inputField.classList.add('input');
  commentContainer.replaceChild(inputField, commentParagraph);

  // 새로운 버튼 추가 (수정, 취소)
  const checkBtnElement = document.createElement('button');
  const cancelBtnElement = document.createElement('button');
  checkBtnElement.textContent = '완료';
  cancelBtnElement.textContent = '취소';
  checkBtnElement.style.visibility = 'visible';
  cancelBtnElement.style.visibility = 'visible';
  btnGroupContainer.appendChild(checkBtnElement);
  btnGroupContainer.appendChild(cancelBtnElement);

  // 완료 버튼 핸들러
  checkBtnElement.addEventListener('click', e => {
    e.preventDefault();

    // UI 먼저 업데이트
    const modifiedComment = inputField.value;
    commentParagraph.textContent = modifiedComment;
    commentContainer.replaceChild(commentParagraph, inputField);

    API.modifyBoardComment(commentId, userId, boardId, modifiedComment)
      .catch(err => {
        // 원래 댓글로 원상 복귀
        commentParagraph.innerHTML = originalComment;

        alert('댓글 변경에 실패했습니다.');
      })
      .finally(() => {
        // 버튼 복구
        btnGroupContainer.replaceChild(editBtnElement, checkBtnElement);
        btnGroupContainer.replaceChild(deleteBtnElement, cancelBtnElement);
      });
  });

  // 취소 버튼 핸들러
  cancelBtnElement.addEventListener('click', e => {
    e.preventDefault();

    // 기존으로 엘리먼트 복구
    commentContainer.replaceChild(commentParagraph, inputField);
    btnGroupContainer.replaceChild(editBtnElement, checkBtnElement);
    btnGroupContainer.replaceChild(deleteBtnElement, cancelBtnElement);
  });
};

/* 댓글 삭제 */
export const handleDeleteComment = (commentId, userId, boardId) => {
  const modalElement = document.getElementById('comment-modal');
  const commentCntElement = document.getElementById('board-comment-cnt');
  const comments = Array.from(document.querySelectorAll('.board-comments-info-container'));
  const commentIndex = comments.findIndex(comment => comment.getAttribute('id') === commentId);

  if (commentIndex !== -1) {
    const removedComment = comments[commentIndex];

    // 댓글 삭제 (UI 즉시 업데이트)
    comments[commentIndex].remove();
    modalElement.close();
    commentCntElement.innerText = (parseInt(commentCntElement.innerText, 10) - 1).toString();

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
  }
};
