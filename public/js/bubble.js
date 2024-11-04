const BUBBLES = [];
const COLORS = ['violet', 'purple', 'yellow', 'red'];
const BODY = document.querySelector(".body");
let INTERVAL_ID = null;

initBubbles();

function initBubbles() {
    _createBubbles();

    setInterval(() => {
        _changeBubbleColor();
    }, Math.random() * 5000 + 1000);
}

function _changeBubbleColor() {
    for (let i = 0; i < COLORS.length; i++) {
        COLORS[i] = _getRandomHexColor();
    }

    for (let i = 0; i < BUBBLES.length; i++) {
        if (Math.random() < 0.2) {
            BUBBLES[i].style.backgroundColor = COLORS[i % COLORS.length];
        }
    }
}

function _getRandomHexColor() {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
}

function _createBubbles() {
    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        const size = Math.random() * 50 + 20;
        bubble.className = 'bubble';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * window.innerWidth}px`;
        bubble.style.top = `${Math.random() * window.innerHeight}px`;
        bubble.style.backgroundColor = COLORS[i % COLORS.length];
        BODY.appendChild(bubble);

        bubble.speedX = Math.random() * 2 - 1; // -1에서 1 사이의 랜덤 속도
        bubble.speedY = Math.random() * 2 - 1; // -1에서 1 사이의 랜덤 속도
        BUBBLES.push(bubble);
    }

    INTERVAL_ID = setInterval(() => {
        BUBBLES.forEach(bubble => {
            const rect = bubble.getBoundingClientRect();

            // 위치 업데이트
            bubble.style.left = `${rect.left + bubble.speedX}px`;
            bubble.style.top = `${rect.top + bubble.speedY}px`;

            // 화면 경계 체크 및 반사
            if (
                rect.left + bubble.speedX < 0 ||
                rect.right + bubble.speedX > window.innerWidth
            ) {
                bubble.speedX *= -1; // x축 반전
            }

            if (
                rect.top + bubble.speedY < 0 ||
                rect.bottom + bubble.speedY > window.innerHeight
            ) {
                bubble.speedY *= -1; // y축 반전
            }
        });
    }, 20);
}