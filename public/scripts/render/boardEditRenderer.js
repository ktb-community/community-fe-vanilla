import API from '../../api/api.js';

export const renderBoardEdit = (userId, boardId) => {
  const editTitleElement = document.getElementById('board-modify-title');
  const editContentElement = document.getElementById('board-modify-content');
  const editImgElement = document.querySelector("#board-modify-img > input[type='file']");
  const submitBtnElement = document.querySelector('#board-modify-btn-container > .submit-btn');
  const titleHelperText = document.getElementById('board-modify-title-helper-text');

  // 수정 폼 값 초기화 함수
  const initBoardEditForm = () => {
    API.fetchBoardDetail(boardId)
      .then(res => {
        const { title, content } = res.data;
        editTitleElement.value = title;
        editContentElement.value = content;
      })
      .then(() => {
        toggleSubmitButton();
      })
      .catch(err => {
        console.error(err.message);
        alert('예상치 못한 에러가 발생했습니다.');
        window.history.back();
      });
  };

  // 제출 버튼 활성화 여부 확인
  const toggleSubmitButton = () => {
    const isTitleValid = editTitleElement.value.trim().length > 0;
    const isContentValid = editContentElement.value.trim().length > 0;
    const isImageSelected = editImgElement.files.length > 0;
    const disabled = !(isTitleValid && isContentValid && isImageSelected);
    submitBtnElement.disabled = disabled;
    submitBtnElement.style.backgroundColor = disabled ? '#D9D9D9' : '#ACA0EB';
    submitBtnElement.style.cursor = disabled ? 'not-allowed' : 'pointer';
  };

  // 제목 입력 핸들러 추가
  editTitleElement.addEventListener('input', e => {
    e.preventDefault();
    const titleLength = editTitleElement.value.length;
    if (titleLength > 26) {
      editTitleElement.value = editTitleElement.value.slice(0, 26); // 26자 초과 제거
      titleHelperText.textContent = '* 제목은 최대 26자까지 입력 가능합니다.';
      titleHelperText.style.color = 'red';
    } else {
      titleHelperText.textContent = '';
    }
    toggleSubmitButton();
  });

  // 본문 입력 핸들러
  editContentElement.addEventListener('input', e => {
    e.preventDefault();
    toggleSubmitButton();
  });

  // 이미지 파일 입력 핸들러
  editImgElement.addEventListener('change', e => {
    e.preventDefault();
    toggleSubmitButton();
  });

  // 제출 버튼 클릭 이벤트
  submitBtnElement.addEventListener('click', e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('title', editTitleElement.value.trim());
    formData.append('content', editContentElement.value.trim());
    formData.append('boardImg', editImgElement.files[0]);

    // 서버로 업로드 요청
    API.editBoard(formData, boardId)
      .then(() => (window.location.href = `/boards/${boardId}`))
      .catch(err => {
        console.error(err.message);
        alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
      });
  });

  initBoardEditForm();
};
