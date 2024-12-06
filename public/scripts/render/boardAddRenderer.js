export const renderBoardAdd = () => {
  // 제목 입력 필드 초기화
  const titleInput = document.getElementById('board-add-title');
  titleInput.value = '';

  // 본문 내용 초기화
  const contentInput = document.getElementById('board-add-content');
  contentInput.value = '';

  // 제출 버튼 초기화
  const submitButton = document.querySelector('.submit-btn');
  submitButton.disabled = true; // 비활성화
};
