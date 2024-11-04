import express from 'express';
import path from 'path';
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

// 경로
const PUBLIC = path.join(__dirname, 'public');
const PAGES = path.join(PUBLIC, "pages")

// 미들웨어 설정
app.use(express.static(PUBLIC)); // 정적 파일 제공 설정

// index 페이지 응답
app.get("/", (req, res) => {
    res.sendFile(path.join(PAGES, 'index.html'));
})

// login 페이지 응답
app.get("/login", (req, res) => {
    res.sendFile(path.join(PAGES, 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
