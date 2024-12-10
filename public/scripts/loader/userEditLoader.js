import { renderUserEdit } from '../render/userEditRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('비정상적인 접근입니다.');
    window.location.href = `/auth/login`;
    return;
  }

  try {
    renderUserEdit(user);
  } catch (err) {
    console.error(err.message);
  }
});
