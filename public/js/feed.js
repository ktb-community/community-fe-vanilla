let currentPage = 1;
const pageSize = 10;
const feedContainer = document.querySelector('#feed-container');

async function _getFeeds(page, size) {
    const res = await fetch(
        `http://localhost:3000/feeds?page=${page}&size=${size}`,
    );

    if (res.status === 200) {
        const feeds = await res.json();
        return feeds.items.map(feed => {
            return `
                <div class="feed">
                    <div class="feed-header">
                        <div class="avatar"></div>
                        <div class="meta-info">
                            <p class="name">${feed.writer}</p>
                            <p class="time">${feed.date}</p>
                        </div>
                        <div class="feed-settings">:</div>
                    </div>
                    <p class="content">${feed.content}</p>
                    <div class="images">
                        <img src="../images/photo_1.jpg" alt="image1">
                        <img src="../images/photo_2.jpg" alt="image2">
                        <img src="../images/photo_3.jpg" alt="image3">
                    </div>
                    <div class="reactions">
                        <button>Like</button>
                        <button>Comment</button>
                    </div>
                </div>
            `;
        });
    }

    return [];
}

async function _loadFeed() {
    setTimeout(async () => {
        const feeds = await _getFeeds(currentPage, pageSize);

        if (feeds.length === 0) {
            if (feedContainer.lastChild.lastChild === null) {
                feedContainer.insertAdjacentHTML(
                    'beforeend',
                    '<h3 style="text-align:center; padding: 50px 0;">End of Pages</h3>',
                );
            }
        } else {
            feeds.forEach(feed =>
                feedContainer.insertAdjacentHTML('beforeend', feed),
            );
            currentPage++;
        }
    }, 1000);
}

// 스크롤 이벤트 리스너 추가
window.addEventListener('scroll', async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 15) {
        await _loadFeed();
    }
});

// 초기 콘텐츠 로드
_loadFeed();
