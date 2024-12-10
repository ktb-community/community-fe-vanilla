import { renderBoardAdd } from '../render/boardAddRenderer.js';
import { handleInputEvents } from '../handler/boardAddHandler.js';

document.addEventListener('DOMContentLoaded', e => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('비정상적인 접근 시도입니다.');
    window.location.href = '/auth/login';
  }

  try {
    renderBoardAdd();
    handleInputEvents(user.id);
  } catch (err) {
    console.error(err.message);
  }
});
