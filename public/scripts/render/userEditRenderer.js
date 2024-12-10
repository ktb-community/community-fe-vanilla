import { includeSpacing, isValidNickname } from '../../utils/utils.js';
import { NICKNAME_HELPER_TEXT, RES_STATUS } from '../../utils/const.js';
import API from '../../api/api.js';

export const renderUserEdit = user => {
  const { profile: profileImg, id: userId, nickname, email } = user;
  let fileChange = false;
  let nicknameChange = false;

  const avatarElement = document.getElementById('user-modify-img');
  const emailTextElement = document.getElementById('user-email-text');
  const profileImgInputElement = document.getElementById('file-upload');
  const nicknameInputElement = document.getElementById('user-modify-nickname-input');
  const nicknameHelperTextElement = document.getElementById('user-modify-nickname-helper-text');
  const editSubmitBtnElement = document.querySelector('#user-modify-btn > input[type="submit"]');
  const withdrawalBtnElement = document.querySelector('#user-modify-btn > a');
  const editDoneBtnElement = document.getElementById('user-modify-done');

  // 수정하기 버튼 초기에 disabled
  editSubmitBtnElement.disabled = true;
  editSubmitBtnElement.style.cursor = `not-allowed`;
  editSubmitBtnElement.style.backgroundColor = '#D9D9D9';

  // 프로필 이미지
  avatarElement.style.backgroundImage = `url(http://localhost:8000/${profileImg})`;
  avatarElement.style.backgroundSize = 'cover';
  avatarElement.style.backgroundRepeat = 'no-repeat';
  avatarElement.style.backgroundPosition = 'center';
  avatarElement.style.cursor = 'pointer';

  // email 및 닉네임 표시
  emailTextElement.innerText = email;
  nicknameInputElement.value = nickname;

  // 수정완료 버튼
  editDoneBtnElement.style.cursor = 'pointer';
  editDoneBtnElement.style.backgroundColor = `#ACA0EB`;

  const toggleEditSubmitBtn = () => {
    const currNickname = nicknameInputElement.value;
    const isValid = (fileChange || nicknameChange) && isValidNickname(currNickname);

    editSubmitBtnElement.disabled = !isValid;
    editSubmitBtnElement.style.cursor = !isValid ? 'not-allowed' : 'pointer';
    editSubmitBtnElement.style.backgroundColor = isValid ? '#ACA0EB' : '#D9D9D9';
  };

  profileImgInputElement.addEventListener('change', e => {
    e.preventDefault();
    const files = e.target.files;

    if (files && files.length === 1) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      avatarElement.style.backgroundImage = `url(${imageUrl})`;
      fileChange = true;
    }

    toggleEditSubmitBtn();
  });

  // 닉네임 이벤트 핸들러 추가
  nicknameInputElement.addEventListener('input', e => {
    e.preventDefault();
    const currNickname = e.target.value;

    nicknameHelperTextElement.textContent =
      currNickname === ''
        ? NICKNAME_HELPER_TEXT.EMPTY
        : includeSpacing(currNickname)
          ? NICKNAME_HELPER_TEXT.SPACING
          : !isValidNickname(currNickname)
            ? NICKNAME_HELPER_TEXT.OVERFLOW
            : '';

    nicknameChange = nickname !== currNickname;
    toggleEditSubmitBtn();
  });

  // 수정하기 버튼 이벤트 추가
  editSubmitBtnElement.addEventListener('click', async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('nickname', nicknameInputElement.value);
    formData.append('fileChange', fileChange);
    if (fileChange) {
      formData.append('profileImg', profileImgInputElement.files[0]);
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
        method: 'PUT',
        body: formData,
      });
      const json = await res.json();

      if (res.status === 400) {
        if (json.status === RES_STATUS.NICKNAME_DUPLICATED) {
          nicknameHelperTextElement.textContent = NICKNAME_HELPER_TEXT.DUPLICATED;
          nicknameInputElement.focus();
        }
      } else if (res.status === 200) {
        const user = JSON.stringify(json.data);
        localStorage.setItem('user', user);
        window.location.reload();
      }

      throw new Error(json.message);
    } catch (err) {
      console.log(err.message);
    }
  });

  // 회원탈퇴 버튼 이벤트 추가
  withdrawalBtnElement.addEventListener('click', e => {
    e.preventDefault();
    console.log('zz');
  });

  // 수정완료 버튼 이벤트 추가
  editDoneBtnElement.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = `/boards`;
  });
};
