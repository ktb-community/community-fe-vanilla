import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/* NOTE
 * - '__dirname': 현재 파일이 위치한 폴더의 절대경로
 * - '__filename': 현재 파일명
 *
 * 위 환경변수는 CommonJS 환경에서만 사용 가능하며, ES Module인 경우 'import.meta.url'을 사용한다.
 */

const app = express();
const PORT = 3000;
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 현재 접속한 유저 정보
let CURRENT_USERS = [];
let cnt = 0;

// 피드목록 읽어오기
const FEEDS = JSON.parse(fs.readFileSync('./feeds.json'));

// 경로
const PUBLIC = path.join(__dirname, './public');

// 미들웨어 설정
app.use(express.static(PUBLIC)); // 정적 파일 제공 설정
app.use(express.urlencoded({ extended: true })); // 폼 데이터 해석 미들웨어

// 기본 경로 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC, '/index.html'));
});

// 로그인 처리
app.post('/login', (req, res) => {
    const loginUser = { ...req.body, loginDate: new Date().toString() };
    const filtered = CURRENT_USERS.filter(user => user.name !== loginUser.name);
    CURRENT_USERS = [...filtered, loginUser];
    const ua = req.headers['user-agent'];
    const ref = req.headers['referer'];
    const host = req.headers['host'];
    const xf = req.headers['forwarded'];

    fs.writeFileSync(
        `test-${cnt++}.txt`,
        JSON.stringify({ ua, ref, host, xf }),
    );

    res.redirect('http://61.109.238.66:3000/community.html');
});

// 현재 접속한 유저 아이디 목록 반환
app.get('/users', (req, res) => {
    const users = CURRENT_USERS.map(user => ({
        name: user.name,
        loginDate: user.loginDate,
    }));

    res.send(users);
});

app.get('/test/:testId', (req, res) => {
    const testId = req.params.testId;
    res.send(fs.readFileSync(`test-${testId}.txt`).toString('utf-8'));
});

// 게시글 목록 반환
app.get('/feeds', (req, res) => {
    res.send(FEEDS);
});

// 단일 게시글 반환
app.get('/feed/:feedId', (req, res) => {
    const feedId = req.params.feedId;
    res.send(FEEDS[feedId - 1]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
