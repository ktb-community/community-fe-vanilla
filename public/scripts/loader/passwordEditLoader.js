import { renderPasswordEdit } from '../render/passwordEditRenderer.js';

document.addEventListener('DOMContentLoaded', e => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('비정상적인 접근 시도입니다.');
    window.history.back();
  }

  try {
    renderPasswordEdit(user);
  } catch (err) {
    console.error(err.message);
  }
});
