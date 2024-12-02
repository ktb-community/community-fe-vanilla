import { isValidEmail, isValidPassword } from '../../utils/utils.js';

const emailElement = document.getElementById('email');
const emailSpanElement = document.getElementById('helper-text-email');
const passwordElement = document.getElementById('password');
const passwordSpanElement = document.getElementById('helper-text-password');
const submitBtnElement = document.getElementById('submit-btn');

document.addEventListener('DOMContentLoaded', e => {
  e.preventDefault();

  /* 이메일, 패스워드 헬퍼 텍스트 등록 */
  if (emailElement && emailSpanElement) {
    emailSpanElement.textContent = '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
  }

  if (passwordElement && passwordSpanElement) {
    passwordSpanElement.textContent = '* 비밀번호를 입력해주세요.';
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
  emailSpanElement.textContent = !isValidEmail(email) ? '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)' : '';
  setSubmitBtn();
});

passwordElement.addEventListener('input', e => {
  e.preventDefault();

  const password = e.target.value;
  passwordSpanElement.textContent =
    password === ''
      ? '* 비밀번호를 입력해주세요.'
      : !isValidPassword(password)
        ? '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
        : '';
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
