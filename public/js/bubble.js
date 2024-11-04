const BUBBLES = [];
const COLORS = ['violet', 'purple', 'yellow'];
let INTERVAL_ID = null;

const toggleContainer = document.querySelector(".toggle-container");

if (toggleContainer) {
    toggleButton(toggleContainer);
}

function toggleButton(element) {
    element.classList.toggle("on"); // on 클래스 추가/제거
    if (element.classList.contains("on")) createBubbles();
    else removeBubbles();
}

function removeBubbles() {
    const bubbleElements = document.body.querySelectorAll('.bubble');

    for (const bubble of bubbleElements) {
        document.body.removeChild(bubble);
    }

    if (INTERVAL_ID) {
        clearInterval(INTERVAL_ID);
    }
}

function createBubbles() {
    if (BUBBLES.length !== 0) {
        BUBBLES.splice(0, BUBBLES.length);
    }

    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        const size = Math.random() * 50 + 20;
        bubble.className = 'bubble';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * window.innerWidth}px`;
        bubble.style.top = `${Math.random() * window.innerHeight}px`;
        bubble.style.backgroundColor = COLORS[i % COLORS.length];
        document.body.appendChild(bubble);

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