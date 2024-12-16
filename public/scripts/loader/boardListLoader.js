import API from '../../api/api.js';
import { BASE_URL } from '../../utils/const.js';

const renderBoardList = boardList => {
  const boardContainerElement = document.getElementById('board-container');
  const fragment = document.createDocumentFragment();

  boardList.forEach(board => {
    const boardDiv = document.createElement('div');
    boardDiv.className = 'boards';
    boardDiv.innerHTML = `
        <h1 class="board-title">${board.title}</h1>
        <div class="board-info">
          <div>
            <span>좋아요 ${board.likeCnt}</span>
            <span>댓글 ${board.commentCnt}</span>
            <span>조회수 ${board.viewCnt}</span>
          </div>
          <div style="font-size: 14px; color: gray;">${board.createdAt}</div>
        </div>
        <hr class="board-hr" />
        <div class="board-writer">
          <div id="avatar-div" class="avatar"></div>
          <span>${board.writerNickname}</span>
        </div>
      `;

    boardDiv.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = `/boards/${board.boardId}`;
    });

    // 아바타 이미지 추가
    const avatarDiv = boardDiv.querySelector('#avatar-div');
    avatarDiv.style.backgroundImage = `url(${BASE_URL}/${board.writerProfileImg})`;
    avatarDiv.style.backgroundSize = 'cover';
    avatarDiv.style.backgroundPosition = 'center';

    fragment.append(boardDiv);
  });

  boardContainerElement.appendChild(fragment);
};

document.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  const triggerElement = document.getElementById('trigger-board-list');

  // 게시글 추가 버튼 이벤트
  const boardAddBtnElement = document.getElementById('board-add-btn');
  boardAddBtnElement.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = '/boards/new';
  });

  let loading = false;
  let currentPage = 0;
  const limit = 10;

  const fetchBoards = async (page, limit) => {
    if (loading) return;
    loading = true;

    try {
      const json = await API.fetchBoardList(page * limit, limit);
      const boardList = json.data;
      renderBoardList(boardList);

      // 더이상 데이터가 없는 경우 옵저버 종료
      if (boardList.length < limit) {
        observer.unobserve(triggerElement);
      } else {
        currentPage++;
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setTimeout(() => {
        loading = false;
      }, 1000);
    }
  };

  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && !loading) {
        fetchBoards(currentPage, limit);
      }
    },
    { rootMargin: '0px', threshold: 1.0 },
  );

  // 옵저버 시작
  observer.observe(triggerElement);

  // 초기 데이터 로드
  fetchBoards(currentPage, limit);
});
