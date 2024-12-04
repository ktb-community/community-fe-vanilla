const REQUEST_URL = 'http://localhost:8000/api/v1';

document.addEventListener('DOMContentLoaded', async () => {
  // 조회수 증가 비동기 패치 요청 함수
  const countBoardView = boardId => {
    return fetch(`${REQUEST_URL}/boards/${boardId}/views`, { method: 'POST' });
  };

  // 게시글 상세 정보 동적 추가 함수
  const appendBoardDetail = boardDetail => {
    /* 게시글 제목 */
    const boardDetailTitleElement = document.getElementById('boards-detail-title');
    boardDetailTitleElement.innerHTML += `
      <h1 class="ellipsis-26">${boardDetail.title}</h1>
    `;

    /* 게시글 메타 정보 */
    const boardDetailInfoContainerElement = document.getElementById('boards-detail-info-container');
    boardDetailInfoContainerElement.innerHTML += `
      <div id="board-detail-info">
        <div id="avatar-div" class="avatar"></div>
        <p id="board-detail-info-writer">${boardDetail.writerNickname}</p>
        <p id="board-detail-info-time">${boardDetail.createdAt}</p>
      </div>
      
      <!-- 수정/삭제 버튼 -->
      <div id="board-detail-btn">
        <input type="button" value="수정" />
        <input type="button" value="삭제" />
      </div>
    `;

    // 아바타 이미지 추가
    const avatarDiv = boardDetailInfoContainerElement.querySelector('#avatar-div');
    avatarDiv.style.backgroundImage = `url(${boardDetail.writerProfileImg})`;
    avatarDiv.style.backgroundSize = 'cover';
    avatarDiv.style.backgroundPosition = 'center';

    /* 이미지와 본문 표시 */
    const boardDetailContentContainerElement = document.getElementById('boards-detail-content-container');
    boardDetailContentContainerElement.innerHTML += `
      <div id="board-detail-img-container">
        <img src=${boardDetail.boardImg} alt="" />
      </div>
      
      <div id="board-detail-content">
        <p>${boardDetail.content}</p>
      </div>
    `;

    /* 좋아요수, 조회수, 댓글수 */
    const boardCntContainerElement = document.getElementById('board-cnt-container');
    boardCntContainerElement.innerHTML += `
      <div>
        <p>${boardDetail.likeCnt}</p>
        <p>좋아요수</p>
      </div>
      
      <div>
        <p>${boardDetail.viewCnt}</p>
        <p>조회수</p>
      </div>
      
      <div>
        <p>${boardDetail.commentCnt}</p>
        <p>댓글수</p>
      </div>
    `;
  };

  // 게시글 상세 정보 요청 함수
  const fetchBoardDetail = async boardId => {
    try {
      const res = await fetch(`${REQUEST_URL}/boards/${boardId}`);
      const json = await res.json();

      if (res.status === 200) {
        const boardDetail = json.data;
        appendBoardDetail(boardDetail);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  // 게시글 댓글 정보 동적 추가 함수
  const appendBoardComments = boardComments => {
    const boardCommentsContainerElement = document.getElementById('board-comments-container');

    boardComments.forEach(boardComment => {});
  };

  // 게시글 댓글 정보 요청 함수
  const fetchBoardComments = async boardId => {
    try {
      const res = await fetch(`${REQUEST_URL}/boards/comments?boardId=${boardId}`);
      const json = await res.json();

      if (res.status === 200) {
        const boardComments = json.data;
        appendBoardComments(boardComments);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  // url 쿼리 파라미터에서 게시글 id 가져오기
  const params = new URLSearchParams(window.location.search);
  const boardId = params.get('id');

  fetchBoardDetail(boardId);
  fetchBoardComments(boardId);
  countBoardView(boardId);
});
