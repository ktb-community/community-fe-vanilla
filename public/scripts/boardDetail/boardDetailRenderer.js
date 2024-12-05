import { handleAddComment, handleEditComment, handleDeleteComment } from './boardCommentHandler.js';
import { handleBoardLike } from './boardDetailHandler.js';

export const renderBoardDetail = (boardDetail, userId, isLiked) => {
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

  // 좋아요 초기 색상 지정 및 이벤트 추가
  const boardLikeBtnElement = document.getElementById('board-like-btn');
  boardLikeBtnElement.style.backgroundColor = isLiked ? '#ACA0EB' : '#D9D9D9';
  boardLikeBtnElement.addEventListener('click', handleBoardLike);
};

/* 댓글 추가 버튼, textarea 렌더링 */
export const renderBoardCommentArea = (userId, boardId) => {
  // 댓글 등록 버튼 이벤트 추가
  const commentAreaElement = document.getElementById('board-comments-add-area');
  const commentAddBtnElement = document.getElementById('board-comments-add-btn');

  commentAreaElement.addEventListener('input', e => {
    const isEmpty = e.target.value === '';
    commentAddBtnElement.style.backgroundColor = isEmpty ? '#ACA0EB' : '#7F6AEE';
    commentAddBtnElement.style.cursor = isEmpty ? 'not-allowed' : 'pointer';
    commentAddBtnElement.disabled = isEmpty;
  });

  commentAddBtnElement.addEventListener('click', e => {
    e.preventDefault();
    handleAddComment(userId, boardId);
  });
};

/* 단건 게시글 코멘트 렌더링 */
export const renderBoardComment = (boardComment, userId) => {
  const boardCommentContainerElement = document.getElementById('board-comments-container');

  // 댓글 컨테이너 생성
  const commentContainer = document.createElement('div');
  commentContainer.className = 'board-comments-info-container';
  commentContainer.setAttribute('id', boardComment.commentId); // 낙관적 업데이트를 위한 id 지정

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
  const isMyComment = boardComment.writerId === userId;
  const btnContainer = document.createElement('div');
  const modifyButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  btnContainer.className = 'board-comments-btn-container';
  modifyButton.textContent = '수정';
  modifyButton.style.visibility = isMyComment ? 'visible' : 'hidden';
  deleteButton.textContent = '삭제';
  deleteButton.style.visibility = isMyComment ? 'visible' : 'hidden';
  btnContainer.appendChild(modifyButton);
  btnContainer.appendChild(deleteButton);

  // 버튼에 이벤트 추가
  if (isMyComment) {
    modifyButton.addEventListener('click', handleEditComment);
    deleteButton.addEventListener('click', handleDeleteComment);
  }

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
};

/* 게시글 코멘트 목록 렌더링 */
export const renderBoardComments = (boardComments, userId) => {
  boardComments.forEach(boardComment => renderBoardComment(boardComment, userId));
};
