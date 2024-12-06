import { renderBoardAdd } from '../render/boardAddRenderer.js';
import { handleInputEvents } from '../handler/boardAddHandler.js';

document.addEventListener('DOMContentLoaded', e => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));

  renderBoardAdd();
  handleInputEvents(user.id);
});
