import { RES_STATUS } from '../../utils/const.js';

const REQUEST_URL = 'http://localhost:3000/api/v1';
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
        emailHelperTextElement.textContent = json.msg;
        alert(json.msg);
        emailElement.focus();
      } else if (json.status === RES_STATUS.PASSWORD_NOT_MATCH) {
        passwordHelperTextElement.textContent = json.msg;
        alert(json.msg);
        passwordElement.focus();
      }

      return;
    }

    /* 로그인 성공 */
    if (res.status === 200) {
      window.location.href = '/';
      localStorage.setItem('user', JSON.stringify(json.data));
      return;
    }

    throw new Error('예상치 못한 에러가 발생했습니다.');
  } catch (e) {
    console.error(`네트워크 에러 발생: ${e}`);
  }
});
