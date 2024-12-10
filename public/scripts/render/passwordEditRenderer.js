import { isValidPassword } from '../../utils/utils.js';
import { PASSWORD_CHECK_HELPER_TEXT, PASSWORD_HELPER_TEXT, RES_STATUS } from '../../utils/const.js';

export const renderPasswordEdit = user => {
  const { email, id: userId } = user;

  const pwInputElement = document.getElementById('password-input');
  const pwCheckInputElement = document.getElementById('password-check-input');
  const submitBtnElement = document.getElementById('password-edit-submit-btn');
  const pwHelperTextElement = document.getElementById('password-helper-text');
  const pwCheckHelperTextElement = document.getElementById('password-check-helper-text');

  // 초기 헬퍼 텍스트 지정 함수
  const initHelperText = () => {
    pwHelperTextElement.textContent = PASSWORD_HELPER_TEXT.EMPTY;
    pwCheckHelperTextElement.textContent = PASSWORD_CHECK_HELPER_TEXT.EMPTY;
  };

  // 버튼 활성화 함수
  const toggleSubmitBtn = () => {
    const pw = pwInputElement.value;
    const pwCheck = pwCheckInputElement.value;
    const isValid = isValidPassword(pw) && pw === pwCheck;
    submitBtnElement.disabled = !isValid;
    submitBtnElement.style.backgroundColor = isValid ? '#ACA0EB' : '#D9D9D9';
    submitBtnElement.style.cursor = isValid ? 'pointer' : 'not-allowed';
  };

  /* 비밀번호 입력 이벤트 핸들러 */
  pwInputElement.addEventListener('input', e => {
    e.preventDefault();
    const pw = pwInputElement.value;
    pwHelperTextElement.textContent = pw === '' ? PASSWORD_HELPER_TEXT.EMPTY : !isValidPassword(pw) ? PASSWORD_HELPER_TEXT.INVALIDATED : '';
    toggleSubmitBtn();
  });

  /* 비밀번호 확인 입력 이벤트 핸들러 */
  pwCheckInputElement.addEventListener('input', e => {
    e.preventDefault();
    const pw = pwInputElement.value;
    const pwCheck = pwCheckInputElement.value;
    pwCheckHelperTextElement.textContent =
      pwCheck === '' ? PASSWORD_CHECK_HELPER_TEXT.EMPTY : pw !== pwCheck ? PASSWORD_HELPER_TEXT.NOT_EQUAL : '';
    toggleSubmitBtn();
  });

  /* Submit 버튼 이벤트 핸들러 */
  submitBtnElement.addEventListener('click', async e => {
    e.preventDefault();

    const password = pwInputElement.value;

    const res = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    try {
      if (json.status === RES_STATUS.SAME_PASSWORD) {
        alert(json.message);
        pwInputElement.focus();
        pwHelperTextElement.textContent = json.message;
      } else if (json.status === RES_STATUS.SUCCESS) {
        alert('비밀번호가 변경되었습니다.\n다시 로그인 해주세요.');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  });

  initHelperText();
  toggleSubmitBtn();
};
