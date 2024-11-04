let currentPage = 1;
const pageSize = 10;
const feedContainer = document.querySelector("#feed-main");
const loadingDiv = document.querySelector("#loading");

async function _getFeeds(page, size) {
    const res = await fetch(`http://localhost:3000/feeds?page=${page}&size=${size}`);

    if (res.status === 200) {
        const feeds = await res.json();
        return feeds.items.map(feed => {
            return `
                <div class="feed">
                    <h3>${feed.title}</h3>
                    <p>${feed.content}</p>
                    <p>${feed.id}</p>
                    <p>${feed.writer}</p>
                    <p>${feed.date}</p>
                </div>
            `;
        });
    }

    return [];
}

async function _loadFeed() {
    loadingDiv.style.display = 'block';

    setTimeout(async () => {
        const feeds = await _getFeeds(currentPage, pageSize);

        if (feeds.length === 0) {
            if (feedContainer.lastChild.lastChild === null) {
                feedContainer.insertAdjacentHTML("beforeend", "<h3>End of Pages</h3>");
            }
        }

        else {
            feeds.forEach(feed => feedContainer.insertAdjacentHTML('beforeend', feed));
            loadingDiv.style.display = 'none';
            currentPage++;
        }
    }, 1000);
}

// 스크롤 이벤트 리스너 추가
window.addEventListener('scroll', async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        await _loadFeed();
    }
});

// 초기 콘텐츠 로드
_loadFeed();