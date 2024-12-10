import { EMAIL_HELPER_TEXT, PASSWORD_HELPER_TEXT, RES_STATUS } from '../../utils/const.js';

const REQUEST_URL = 'http://localhost:8000/api/v1';
const formElement = document.getElementById('login-form');
const emailElement = document.getElementById('email');
const passwordElement = document.getElementById('password');
const emailHelperTextElement = document.getElementById('helper-text-email');
const passwordHelperTextElement = document.getElementById('helper-text-password');

formElement.addEventListener('submit', async e => {
  e.preventDefault();

  const email = emailElement.value;
  const password = passwordElement.value;

  try {
    const res = await fetch(`${REQUEST_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const json = await res.json();

    /* 요청 실패 (400) */
    if (res.status === 400) {
      if (json.status === RES_STATUS.EMAIL_NOT_FOUND) {
        emailHelperTextElement.textContent = EMAIL_HELPER_TEXT.NOT_FOUND;
        alert(json.message);
        emailElement.focus();
      } else if (json.status === RES_STATUS.PASSWORD_NOT_MATCH) {
        passwordHelperTextElement.textContent = PASSWORD_HELPER_TEXT.INVALIDATED;
        alert(json.message);
        passwordElement.focus();
      }
    } else if (res.status === 200) {
      /* 로그인 성공 */
      window.location.href = '/boards';
      localStorage.setItem('user', JSON.stringify(json.data));
      return;
    }

    throw new Error('예상치 못한 에러가 발생했습니다.');
  } catch (e) {
    console.error(`네트워크 에러 발생: ${e}`);
  }
});
