import { EMAIL_HELPER_TEXT, NICKNAME_HELPER_TEXT } from '../../utils/const.js';
import { RES_STATUS } from '../../utils/const.js';

const REQUEST_URL = 'http://localhost:8000/api/v1';
const profileImgInputElement = document.getElementById('file-upload');
const emailInputElement = document.getElementById('email');
const passwordInputElement = document.getElementById('password');
const nicknameInputElement = document.getElementById('nickname');
const signupFormElement = document.getElementById('signup-form');
const emailHelperTextElement = document.getElementById('helper-text-email');
const nicknameHelperTextElement = document.getElementById('helper-text-nickname');

signupFormElement.addEventListener('submit', async e => {
  e.preventDefault();

  const profileImg = profileImgInputElement.files[0];
  const email = emailInputElement.value;
  const password = passwordInputElement.value;
  const nickname = nicknameInputElement.value;

  const formData = new FormData();
  formData.append('profileImg', profileImg);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('nickname', nickname);

  try {
    const res = await fetch(`${REQUEST_URL}/auth/signup`, {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();

    if (res.status === 400) {
      if (json.status === RES_STATUS.EMAIL_DUPLICATED) {
        emailHelperTextElement.textContent = EMAIL_HELPER_TEXT.DUPLICATED;
        alert(json.message);
        emailInputElement.focus();
      } else if (json.status === RES_STATUS.NICKNAME_DUPLICATED) {
        nicknameHelperTextElement.textContent = NICKNAME_HELPER_TEXT.DUPLICATED;
        alert(json.message);
        nicknameInputElement.focus();
      }
    }

    if (res.status === 201) {
      alert(json.message);
      window.location.href = '/login';
    }
  } catch (e) {
    console.error(`네트워크 에러 발생: ${e}`);
  }
});
