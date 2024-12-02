const express = require('express');
const path = require('path');
const fs = require('fs');
const { sendJSONResponse } = require('./utils/utils.js');

const app = express();
const PORT = 3000;

// 경로
const DIR_PATH = {
  get UPLOADS() {
    return path.join(__dirname, 'uploads');
  },
  get PUBLIC() {
    return path.join(__dirname, 'public');
  },
  get PAGES() {
    return path.join(this.PUBLIC, 'pages');
  },
  get JSON() {
    return path.join(this.PUBLIC, 'json');
  },
};

const HTML_PATH = {
  BOARD_LIST: path.join(DIR_PATH.PAGES, 'index.html'),
  BOARD_DETAIL: path.join(DIR_PATH.PAGES, 'board.html'),
  BOARD_MODIFY: path.join(DIR_PATH.PAGES, 'boardModify.html'),
  BOARD_ADD: path.join(DIR_PATH.PAGES, 'boardAdd.html'),
  LOGIN: path.join(DIR_PATH.PAGES, 'login.html'),
  SIGNUP: path.join(DIR_PATH.PAGES, 'signup.html'),
  USER_MODIFY: path.join(DIR_PATH.PAGES, 'userModify.html'),
  PASSWORD_MODIFY: path.join(DIR_PATH.PAGES, 'passwordModify.html'),
  NOT_FOUND: path.join(DIR_PATH.PAGES, 'notFound.html'),
};

// 미들웨어 설정
app.use(express.static(DIR_PATH.UPLOADS));
app.use(express.static(DIR_PATH.PUBLIC)); // 정적 파일 제공 설정
app.use(express.urlencoded({ extended: true })); // 임시 로그인 기능을 위해 인코딩 해석 미들웨어 추가
app.use(express.json());

// index 페이지 응답
app.get('/', (req, res) => {
  res.sendFile(HTML_PATH.BOARD_LIST);
});

// login 페이지 응답
app.get('/login', (req, res) => {
  res.sendFile(HTML_PATH.LOGIN);
});

// signup 페이지 응답
app.get('/signup', (req, res) => {
  res.sendFile(HTML_PATH.SIGNUP);
});

// 게시글 상세 페이지 응답
app.get('/boardDetail', (req, res) => {
  res.sendFile(HTML_PATH.BOARD_DETAIL);
});

// 게시글 추가 페이지 응답
app.get('/boardAdd', (req, res) => {
  res.sendFile(HTML_PATH.BOARD_ADD);
});

// 게시글 수정 페이지 응답
app.get('/boardModify', (req, res) => {
  res.sendFile(HTML_PATH.BOARD_MODIFY);
});

// 유저 닉네임 수정 페이지 응답
app.get('/userModify', (req, res) => {
  res.sendFile(HTML_PATH.USER_MODIFY);
});

// 비밀번호 수정 페이지 응답
app.get('/passwordModify', (req, res) => {
  res.sendFile(HTML_PATH.PASSWORD_MODIFY);
});

// ================================== API RESPONSE ======================================
const RES_STATUS = Object.freeze({
  SUCCESS: 'Success',
  FAIL: 'Fail',
  ERROR: 'Error',

  /* LOGIN */
  EMAIL_NOT_FOUND: 'Email not found',
  PASSWORD_NOT_MATCH: 'Password not match',
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const json = JSON.parse(fs.readFileSync(`${DIR_PATH.JSON}/users.json`, 'utf-8'));
    const users = json.data;
    const findedUser = users.find(user => user.email === email);

    /* 존재하지 않는 유저인 경우 */
    if (!findedUser) {
      return sendJSONResponse(res, 400, RES_STATUS.EMAIL_NOT_FOUND, '* 가입되지 않은 계정입니다.');
    }

    /* 비밀번호가 일치하지 않는 경우 */
    if (findedUser.password !== password) {
      return sendJSONResponse(res, 400, RES_STATUS.PASSWORD_NOT_MATCH, '* 비밀번호가 다릅니다.');
    }

    const resData = {
      id: findedUser.id,
      email: findedUser.email,
      nickname: findedUser.nickname,
      lastLoginDate: findedUser.lastLoginDate,
      profileImg: findedUser.profileImg,
    };

    return sendJSONResponse(res, 200, RES_STATUS.SUCCESS, '로그인이 성공적으로 완료되었습니다.', resData);
  } catch (e) {
    console.error(e);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
