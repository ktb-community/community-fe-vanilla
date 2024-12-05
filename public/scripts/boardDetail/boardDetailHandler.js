import API from '../../api/api.js';

export const handleBoardLike = async e => {
  e.preventDefault();
  const boardLikeBtnElement = document.getElementById('board-like-btn');
  const boardLikeCntElement = document.getElementById('board-like-cnt');

  try {
    if (!toggle) {
      boardLikeCntElement.innerHTML = parseInt(boardDetail.likeCnt, 10) + 1;
      boardLikeBtnElement.style.backgroundColor = '#ACA0EB';
    } else {
      boardLikeCntElement.innerHTML = parseInt(boardLikeCntElement.innerHTML, 10) - 1;
      boardLikeBtnElement.style.backgroundColor = '#D9D9D9';
    }

    API.toggleBoardLike(userId, boardDetail.boardId);
  } catch (err) {
    console.error(err.message);
  }
};

export const handleModalOpen = () => {
  const modalElement = document.getElementById('my-modal');

  console.log(modalElement);

  if (modalElement) {
    modalElement.open();
  }
};
