import API from '../../api/api.js';

export const handleInputEvents = userId => {
  const titleInput = document.getElementById('board-add-title');
  const contentInput = document.getElementById('board-add-content');
  const imageInput = document.querySelector('#board-add-img input[type="file"]');
  const submitButton = document.querySelector('.submit-btn');
  const titleHelperText = document.getElementById('board-add-title-helper-text');

  // 제출 버튼 활성화 여부 확인
  const toggleSubmitButton = () => {
    const isTitleValid = titleInput.value.trim().length > 0;
    const isContentValid = contentInput.value.trim().length > 0;
    const isImageSelected = imageInput.files.length > 0;
    const disabled = !(isTitleValid && isContentValid && isImageSelected);
    submitButton.disabled = disabled;
    submitButton.style.backgroundColor = disabled ? '#D9D9D9' : '#ACA0EB';
    submitButton.style.cursor = disabled ? 'not-allowed' : 'pointer';
  };

  // 제목 입력 제한 (최대 26자)
  titleInput.addEventListener('input', () => {
    const titleLength = titleInput.value.length;
    if (titleLength > 26) {
      titleInput.value = titleInput.value.slice(0, 26); // 26자 초과 제거
      titleHelperText.textContent = '* 제목은 최대 26자까지 입력 가능합니다.';
      titleHelperText.style.color = 'red';
    } else {
      titleHelperText.textContent = '';
    }
    toggleSubmitButton();
  });

  // 본문 내용 및 이미지 입력 이벤트 처리
  contentInput.addEventListener('input', toggleSubmitButton);
  imageInput.addEventListener('change', toggleSubmitButton);

  // 제출 버튼 클릭 이벤트
  submitButton.addEventListener('click', () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('title', titleInput.value.trim());
    formData.append('content', contentInput.value.trim());
    formData.append('boardImg', imageInput.files[0]);

    // 서버로 업로드 요청
    API.addBoard(formData)
      .then(() => (window.location.href = '/boards'))
      .catch(err => {
        console.error(err.message);
        alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
      });
  });

  // 초기 버튼 상태 지정
  toggleSubmitButton();
};
