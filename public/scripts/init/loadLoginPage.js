import { isValidEmail, isValidPassword } from '../../utils/utils.js';
import { EMAIL_HELPER_TEXT, PASSWORD_HELPER_TEXT } from '../../utils/const.js';
const emailElement = document.getElementById('email');
const emailHelperTextElement = document.getElementById('helper-text-email');
const passwordElement = document.getElementById('password');
const passwordHelperTextElement = document.getElementById('helper-text-password');
const submitBtnElement = document.getElementById('submit-btn');

document.addEventListener('DOMContentLoaded', e => {
  e.preventDefault();

  /* 이메일, 패스워드 헬퍼 텍스트 등록 */
  if (emailHelperTextElement && emailElement) {
    emailHelperTextElement.textContent = EMAIL_HELPER_TEXT.INVALIDATED;
  }

  if (passwordElement && passwordHelperTextElement) {
    passwordHelperTextElement.textContent = PASSWORD_HELPER_TEXT.EMPTY;
  }

  /* 로그인 버튼 설정 */
  submitBtnElement.classList.remove('isAllowed');
  submitBtnElement.classList.add('isNotAllowed');
  submitBtnElement.disabled = true;

  /* 기본 포커스 */
  emailElement.focus();
});

emailElement.addEventListener('input', e => {
  e.preventDefault();

  const email = e.target.value;
  emailHelperTextElement.textContent = !isValidEmail(email) ? EMAIL_HELPER_TEXT.INVALIDATED : '';
  setSubmitBtn();
});

passwordElement.addEventListener('input', e => {
  e.preventDefault();

  const password = e.target.value;
  passwordHelperTextElement.textContent =
    password === '' ? PASSWORD_HELPER_TEXT.EMPTY : !isValidPassword(password) ? PASSWORD_HELPER_TEXT.INVALIDATED : '';
  setSubmitBtn();
});

function setSubmitBtn() {
  const emailValidation = isValidEmail(emailElement.value);
  const passwordValidation = isValidPassword(passwordElement.value);
  submitBtnElement.disabled = !(emailValidation && passwordValidation);

  if (emailValidation && passwordValidation) {
    submitBtnElement.classList.add('isAllowed');
    submitBtnElement.classList.remove('isNotAllowed');
  } else {
    submitBtnElement.classList.add('isNotAllowed');
    submitBtnElement.classList.remove('isAllowed');
  }
}
