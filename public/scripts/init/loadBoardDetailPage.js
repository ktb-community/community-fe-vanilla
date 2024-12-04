import API from '../../api/api.js';

let toggle = false;

const renderBoardDetail = (boardDetail, userId, isLiked) => {
  // 제목
  document.getElementById('board-detail-title').innerHTML = `
    <h1 class="ellipsis-26">${boardDetail.title}</h1>
  `;

  // 메타 정보
  document.getElementById('board-detail-info-container').innerHTML = `
    <div id="board-detail-info">
      <div id="avatar-div" class="avatar" style="background-image: url(${boardDetail.writerProfileImg}); background-size: cover;"></div>
      <p id="board-detail-info-writer">${boardDetail.writerNickname}</p>
      <p id="board-detail-info-time">${boardDetail.createdAt}</p>
    </div>
  `;

  // 본문
  document.getElementById('board-detail-content-container').innerHTML = `
    <div id="board-detail-img-container">
      <img src="${boardDetail.boardImg || ''}" alt="" />
    </div>
    <div id="board-detail-content">
      <p>${boardDetail.content}</p>
    </div>
  `;

  // 좋아요, 조회수, 댓글수
  document.getElementById('board-cnt-container').innerHTML = `
    <div id="board-like-btn">
      <p id="board-like-cnt">${boardDetail.likeCnt}</p>
      <p>좋아요</p>
    </div>
    <div>
      <p>${boardDetail.viewCnt}</p>
      <p>조회수</p>
    </div>
    <div>
      <p>${boardDetail.commentCnt}</p>
      <p>댓글</p>
    </div>
  `;

  // 좋아요 초기 색상 지정
  const boardLikeBtnElement = document.getElementById('board-like-btn');
  boardLikeBtnElement.style.backgroundColor = isLiked ? '#ACA0EB' : '#D9D9D9';

  // 좋아요 버튼 핸들링
  const boardLikeCntElement = document.getElementById('board-like-cnt');
  boardLikeBtnElement.addEventListener('click', async e => {
    e.preventDefault();

    try {
      await API.toggleBoardLike(userId, boardDetail.boardId);

      if (!toggle) {
        boardLikeCntElement.innerHTML = parseInt(boardDetail.likeCnt, 10) + 1;
        boardLikeBtnElement.style.backgroundColor = '#ACA0EB';
      } else {
        boardLikeCntElement.innerHTML = parseInt(boardDetail.likeCnt, 10);
        boardLikeBtnElement.style.backgroundColor = '#D9D9D9';
      }

      toggle = !toggle;
    } catch (err) {
      console.error(err.message);
    }
  });
};

const renderBoardComments = boardComments => {
  const boardCommentsContainerElement = document.getElementById('board-comments-container');
};

document.addEventListener('DOMContentLoaded', async () => {
  // url 쿼리 파라미터에서 게시글 id 가져오기
  const url = new URL(window.location.href);
  const segments = url.pathname.split('/');
  const boardId = segments[2];
  const userId = JSON.parse(localStorage.getItem('user')).id;

  if (!boardId) {
    alert('비정상적인 접근입니다.');
    window.location.href = '/boards';
    return;
  }

  try {
    // 데이터 가져오기
    const { data: boardDetail } = await API.fetchBoardDetail(boardId);
    const { data: checkBoardLike } = await API.checkBoardLike(userId, boardId);
    //const { data: boardComments } = await API.fetchBoardComments(boardId);

    // 렌더링
    toggle = checkBoardLike;
    renderBoardDetail(boardDetail, userId, checkBoardLike || false);
    // renderBoardComments(boardComments);

    // 조회수 증가
    API.incrementBoardViewCount(boardId);
  } catch (err) {
    console.error(err.message);
  }
});
