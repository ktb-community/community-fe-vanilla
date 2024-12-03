import {
  EMAIL_HELPER_TEXT,
  PROFILE_IMG_HELPER_TEXT,
  PASSWORD_HELPER_TEXT,
  PASSWORD_CHECK_HELPER_TEXT,
  NICKNAME_HELPER_TEXT,
} from '../../utils/const.js';
import { includeSpacing, isValidEmail, isValidNickname, isValidPassword } from '../../utils/utils.js';

const prevBtnElement = document.getElementById('prev-btn');
const profileImgInputElement = document.getElementById('file-upload');
const profileImgAvatarElement = document.getElementById('profile-img-avatar');
const emailInputElement = document.getElementById('email');
const passwordInputElement = document.getElementById('password');
const passwordCheckInputElement = document.getElementById('password-check');
const nicknameInputElement = document.getElementById('nickname');
const signupBtnElement = document.getElementById('signup-btn');

/* HELPER TEXT */
const profileImgHelperTextElement = document.getElementById('helper-text-profile-img');
const emailHelperTextElement = document.getElementById('helper-text-email');
const passwordHelperTextElement = document.getElementById('helper-text-password');
const passwordCheckHelperTextElement = document.getElementById('helper-text-password-check');
const nicknameHelperTextElement = document.getElementById('helper-text-nickname');

document.addEventListener('DOMContentLoaded', e => {
  e.preventDefault();

  /* 프로필 이미지 헬퍼 텍스트 설정 */
  if (profileImgInputElement.files.length === 0) {
    profileImgHelperTextElement.textContent = PROFILE_IMG_HELPER_TEXT.EMPTY;
  }

  /* 나머지 헬퍼 텍스트 설정 */
  emailHelperTextElement.textContent = EMAIL_HELPER_TEXT.EMPTY;
  passwordHelperTextElement.textContent = PASSWORD_HELPER_TEXT.EMPTY;
  passwordCheckHelperTextElement.textContent = PASSWORD_CHECK_HELPER_TEXT.EMPTY;
  nicknameHelperTextElement.textContent = NICKNAME_HELPER_TEXT.EMPTY;

  /* 버튼 disable 설정 */
  signupBtnElement.classList.remove('isAllowed');
  signupBtnElement.classList.add('isNotAllowed');
  signupBtnElement.disabled = true;
});

prevBtnElement.addEventListener('click', e => {
  e.preventDefault();
  window.history.back();
});

profileImgInputElement.addEventListener('change', e => {
  e.preventDefault();
  const files = e.target.files;
  const avatarIconElement = document.querySelector('.file-label > p');

  if (files && files.length === 1) {
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);

    profileImgHelperTextElement.textContent = '';
    profileImgAvatarElement.style.backgroundImage = 'url(' + imageUrl + ')';
    profileImgAvatarElement.style.backgroundPosition = 'center center';
    profileImgAvatarElement.style.backgroundSize = 'cover';
    avatarIconElement.style.zIndex = -1;
  } else {
    profileImgInputElement.value = '';
    profileImgHelperTextElement.textContent = PROFILE_IMG_HELPER_TEXT.EMPTY;
    profileImgAvatarElement.style.backgroundImage = '';
    profileImgAvatarElement.style.backgroundPosition = '';
    profileImgAvatarElement.style.backgroundSize = '';
    avatarIconElement.style.zIndex = 0;
  }

  setSignupBtn();
});

emailInputElement.addEventListener('input', e => {
  e.preventDefault();
  const email = e.target.value;
  emailHelperTextElement.textContent = email === '' ? EMAIL_HELPER_TEXT.EMPTY : !isValidEmail(email) ? EMAIL_HELPER_TEXT.INVALIDATED : '';
  setSignupBtn();
});

passwordInputElement.addEventListener('input', e => {
  e.preventDefault();
  const password = e.target.value;
  passwordHelperTextElement.textContent =
    password === '' ? PASSWORD_HELPER_TEXT.EMPTY : !isValidPassword(password) ? PASSWORD_HELPER_TEXT.INVALIDATED : '';

  setSignupBtn();
});

passwordCheckInputElement.addEventListener('input', e => {
  e.preventDefault();
  const password = passwordInputElement.value;
  const passwordCheck = e.target.value;

  if (passwordCheck === '') {
    passwordCheckHelperTextElement.textContent = PASSWORD_CHECK_HELPER_TEXT.EMPTY;
    return;
  }

  if (password !== passwordCheck) {
    passwordHelperTextElement.textContent = PASSWORD_HELPER_TEXT.NOT_EQUAL;
    passwordCheckHelperTextElement.textContent = PASSWORD_CHECK_HELPER_TEXT.NOT_EQUAL;
    return;
  }

  // 두 비밀번호가 일치하는 경우
  passwordHelperTextElement.textContent = !(isValidPassword(password) && isValidPassword(passwordCheck))
    ? PASSWORD_HELPER_TEXT.INVALIDATED
    : '';
  passwordCheckHelperTextElement.textContent = !(isValidPassword(password) && isValidPassword(passwordCheck))
    ? PASSWORD_HELPER_TEXT.INVALIDATED
    : '';

  setSignupBtn();
});

nicknameInputElement.addEventListener('input', e => {
  e.preventDefault();
  const nickname = e.target.value;

  nicknameHelperTextElement.textContent =
    nickname === ''
      ? NICKNAME_HELPER_TEXT.EMPTY
      : includeSpacing(nickname)
        ? NICKNAME_HELPER_TEXT.SPACING
        : !isValidNickname(nickname)
          ? NICKNAME_HELPER_TEXT.OVERFLOW
          : '';

  setSignupBtn();
});

function setSignupBtn() {
  const password = passwordInputElement.value;
  const passwordCheck = passwordCheckInputElement.value;

  const emailValidation = isValidEmail(emailInputElement.value);
  const passwordValidation = isValidPassword(password);
  const passwordCheckValidation = isValidPassword(passwordCheck);
  const nicknameValidation = isValidNickname(nicknameInputElement.value);
  const profileImgValidation = profileImgInputElement.value !== '';

  const allowed =
    password === passwordCheck &&
    emailValidation &&
    passwordValidation &&
    passwordCheckValidation &&
    nicknameValidation &&
    profileImgValidation;

  if (allowed) {
    signupBtnElement.classList.add('isAllowed');
    signupBtnElement.classList.remove('isNotAllowed');
    signupBtnElement.disabled = false;
  } else {
    signupBtnElement.classList.remove('isAllowed');
    signupBtnElement.classList.add('isNotAllowed');
    signupBtnElement.disabled = true;
  }
}
