async function updateCurrentUser(e) {
    const res = await fetch('http://192.168.0.12:3000/users');

    if (res.ok) {
        const users = await res.json();

        const parent = document.querySelector('#user-list');
        parent.innerHTML = '';

        users.forEach(user => {
            const item = document.createElement('p');
            item.innerHTML = `${user.name} (${convertDate(user.loginDate)})`;
            parent.appendChild(item);
        });
    }
}

function convertDate(date) {
    const curr = new Date(date);
    const month = String(curr.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(curr.getDate()).padStart(2, '0');
    const hours = String(curr.getHours()).padStart(2, '0');
    const minutes = String(curr.getMinutes()).padStart(2, '0');

    // 원하는 형식으로 조합
    return `${month}/${day} ${hours}:${minutes}`;
}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateCurrentUser, 1000);
});
