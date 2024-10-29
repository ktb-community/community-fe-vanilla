async function getNewsFeeds(e) {
    e.preventDefault();
    const res = await fetch('http://192.168.0.12:3000/feeds');
    const feedsElement = document.querySelector('#feeds');

    if (res.ok) {
        // feedId, title, content, date, writer, profileImage
        const feeds = await res.json();

        feeds.forEach(feed => {
            const feedElement = document.createElement('article');
            feedElement.className = 'feed';

            const divFirst = document.createElement('div');
            const titleP = document.createElement('p');
            const writerP = document.createElement('p');
            const dateP = document.createElement('p');

            const innerFlex = document.createElement('div');
            titleP.innerHTML = feed.title;
            writerP.innerHTML = feed.writer;
            dateP.innerHTML = feed.date;

            innerFlex.appendChild(writerP);
            innerFlex.appendChild(dateP);
            innerFlex.className = 'innerFlex';

            divFirst.appendChild(titleP);
            divFirst.appendChild(innerFlex);
            divFirst.className = 'feedInfo';

            const imageCard = document.createElement('div');
            imageCard.style.backgroundImage = `url(${feed.profileImage})`;
            imageCard.className = 'imageCard';

            /** [만드려는 형태]
             * <article class="feed">
             *      <div class="imageCard">
             *      </div>
             *      <div className="feedInfo">
             *          <p>{title}</p>
             *          <div className="innerFlex">
             *              <p>{writer}</p>
             *              <p>{date}</p>
             *          </div>
             *      </div>
             * </article>
             */

            feedElement.appendChild(imageCard);
            feedElement.appendChild(divFirst);
            feedsElement.appendChild(feedElement);

            feedElement.addEventListener('click', async e => {
                e.preventDefault();
                const res = await fetch(
                    `http://192.168.0.12:3000/feed/${feed.id}`,
                );

                if (res.ok) {
                    const feedDetail = await res.json();
                    const article = document.querySelector('.article');
                    const articleTitle =
                        document.querySelector('.article-title');
                    const articleWriter =
                        document.querySelector('.article-writer');
                    const articleContent =
                        document.querySelector('.article-content');
                    const articleDiv = document.querySelector('.article > div');

                    // 기존 모든 자식 엘리먼트 제거
                    while (article.firstChild) {
                        article.removeChild(article.firstChild);
                    }

                    // content의 '\n'을 '<br/>'로 바꿔주는 작업 필요
                    articleTitle.innerHTML = feedDetail.title;
                    articleWriter.innerHTML =
                        feedDetail.writer + ' - ' + feedDetail.date;
                    articleContent.innerHTML = feedDetail.content.replace(
                        /\n/g,
                        '<br/>',
                    );

                    articleDiv.appendChild(articleTitle);
                    articleDiv.appendChild(articleWriter);

                    article.appendChild(articleDiv);
                    article.appendChild(articleContent);
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', getNewsFeeds);
