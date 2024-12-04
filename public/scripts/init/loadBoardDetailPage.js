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
      if (!toggle) {
        boardLikeCntElement.innerHTML = parseInt(boardDetail.likeCnt, 10) + 1;
        boardLikeBtnElement.style.backgroundColor = '#ACA0EB';
      } else {
        boardLikeCntElement.innerHTML = parseInt(boardLikeCntElement.innerHTML, 10) - 1;
        boardLikeBtnElement.style.backgroundColor = '#D9D9D9';
      }

      toggle = !toggle;
      API.toggleBoardLike(userId, boardDetail.boardId);
    } catch (err) {
      console.error(err.message);
    }
  });
};

const renderBoardComments = (boardComments, userId) => {
  const boardCommentContainerElement = document.getElementById('board-comments-container');

  boardComments.forEach(boardComment => {
    // 댓글 컨테이너 생성
    const commentContainer = document.createElement('div');
    commentContainer.className = 'board-comments-info-container';

    // 댓글 메타 정보 컨테이너
    const metaContainer = document.createElement('div');
    metaContainer.className = 'board-comments-meta-container';

    const infoContainer = document.createElement('div');
    infoContainer.className = 'board-comments-info';

    // 아바타 설정
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.style.backgroundImage = `url(${boardComment.writerProfileImg})`;
    avatar.style.backgroundSize = 'cover';
    avatar.style.backgroundRepeat = 'no-repeat';
    avatar.style.backgroundPosition = 'center';

    // 작성자 닉네임
    const writerNickname = document.createElement('p');
    writerNickname.className = 'board-comments-info-writer';
    writerNickname.textContent = boardComment.writerNickname;

    // 작성 시간
    const createdAt = document.createElement('p');
    createdAt.className = 'board-comments-info-time';
    createdAt.textContent = boardComment.createdAt;

    infoContainer.appendChild(avatar);
    infoContainer.appendChild(writerNickname);
    infoContainer.appendChild(createdAt);

    // 버튼 컨테이너
    const btnContainer = document.createElement('div');
    btnContainer.className = 'board-comments-btn-container';

    const modifyButton = document.createElement('button');
    modifyButton.textContent = '수정';
    modifyButton.style.visibility = boardComment.writerId === userId ? 'visible' : 'hidden';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.style.visibility = boardComment.writerId === userId ? 'visible' : 'hidden';

    btnContainer.appendChild(modifyButton);
    btnContainer.appendChild(deleteButton);

    metaContainer.appendChild(infoContainer);
    metaContainer.appendChild(btnContainer);

    // 댓글 내용 컨테이너
    const commentContentContainer = document.createElement('div');
    commentContentContainer.className = 'board-comments-comment-container';

    const commentContent = document.createElement('p');
    commentContent.textContent = boardComment.content;

    commentContentContainer.appendChild(commentContent);

    // 모든 요소 조합
    commentContainer.appendChild(metaContainer);
    commentContainer.appendChild(commentContentContainer);

    // 댓글 컨테이너 추가
    boardCommentContainerElement.appendChild(commentContainer);
  });
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
    const { data: boardComments } = await API.fetchBoardComments(boardId);

    // 렌더링
    toggle = checkBoardLike;
    renderBoardDetail(boardDetail, userId, checkBoardLike || false);
    renderBoardComments(boardComments, userId);

    // 조회수 증가
    API.incrementBoardViewCount(boardId);
  } catch (err) {
    console.error(err.message);
  }

  // 댓글 등록 버튼 이벤트 추가
  const commentAreaElement = document.getElementById('board-comments-add-area');
  const commentAddBtnElement = document.getElementById('board-comments-add-btn');
});
