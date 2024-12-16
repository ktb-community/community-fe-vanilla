const express = require('express');
const path = require('path');
const app = express();

// 경로
const DIR_PATH = {
  UPLOADS: path.join(__dirname, 'uploads'),
  PUBLIC: path.join(__dirname, 'public'),
  PAGES: path.join(__dirname, 'public', 'pages'),
};

const HTML_PATH = {
  BOARD_LIST: path.join(DIR_PATH.PAGES, 'boardList.html'),
  BOARD_DETAIL: path.join(DIR_PATH.PAGES, 'boardDetail.html'),
  BOARD_ADD: path.join(DIR_PATH.PAGES, 'boardAdd.html'),
  BOARD_EDIT: path.join(DIR_PATH.PAGES, 'boardEdit.html'),
  LOGIN: path.join(DIR_PATH.PAGES, 'login.html'),
  SIGNUP: path.join(DIR_PATH.PAGES, 'signup.html'),
  USER_EDIT: path.join(DIR_PATH.PAGES, 'userEdit.html'),
  PASSWORD_EDIT: path.join(DIR_PATH.PAGES, 'passwordEdit.html'),
  NOT_FOUND: path.join(DIR_PATH.PAGES, 'notFound.html'),
};

// 미들웨어 설정
app.use(express.static(DIR_PATH.PUBLIC)); // 정적 파일 제공 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우팅
app.get('/', (req, res) => res.redirect('/boards'));
app.get('/auth/login', (req, res) => res.sendFile(HTML_PATH.LOGIN));
app.get('/auth/signup', (req, res) => res.sendFile(HTML_PATH.SIGNUP));

// 게시글 라우트
app.get('/boards', (req, res) => res.sendFile(HTML_PATH.BOARD_LIST));
app.get('/boards/new', (req, res) => res.sendFile(HTML_PATH.BOARD_ADD));
app.get('/boards/:id', (req, res) => res.sendFile(HTML_PATH.BOARD_DETAIL));
app.get('/boards/:id/edit', (req, res) => res.sendFile(HTML_PATH.BOARD_EDIT));

// 유저 관련 라우트
app.get('/users/edit', (req, res) => res.sendFile(HTML_PATH.USER_EDIT));
app.get('/users/edit/password', (req, res) => res.sendFile(HTML_PATH.PASSWORD_EDIT));

// 404 처리
app.use((req, res) => {
  res.status(404).sendFile(HTML_PATH.NOT_FOUND);
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  const host = process.env.NODE_ENV === 'development' ? '127.0.0.1' : '61.109.238.66';
  console.log(`Server is running on http://${host}:${PORT}`);
});
