import {Api} from './lib.js';

// const api = new Api('https://blackrider116-express-api.herokuapp.com');
const api = new Api('http://localhost:9999');

const rootEl = document.getElementById('root');

const addFormEl = document.createElement('form');
addFormEl.className = 'form-inline mb-2';
addFormEl.innerHTML = `
    <div class="form-group">
        <input class="form-control" placeholder="Введите текст или url" data-id="link">
    </div>
    <select class="custom-select" data-id="type">
        <option value="regular">Обычный</option>
        <option value="image">Изображение</option>
        <option value="audio">Аудио</option>
        <option value="video">Видео</option>
    </select>
    <button class="btn btn-primary">Добавить</button>
`;

const linkEl = addFormEl.querySelector('[data-id=link]');
const typeEl = addFormEl.querySelector('[data-id=type]');
linkEl.value = localStorage.getItem('content');
linkEl.addEventListener('input', (evt) => {
    localStorage.setItem('content', evt.currentTarget.value);
});
if (localStorage.getItem('type') !== null) {
typeEl.value = localStorage.getItem('type');
}
typeEl.addEventListener('input', (evt) => {
    localStorage.setItem('type', evt.currentTarget.value);
});


addFormEl.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const post = {
        id: 0,
        content: linkEl.value,
        type: typeEl.value,
    };
    api.postJSON('/posts', post, data => {
        rebuildList(postsEl, data);
    }, error => {
        console.log(error)
    });
    linkEl.value = '';
    typeEl.value = 'regular';
    localStorage.clear();
});
rootEl.appendChild(addFormEl);

const postsEl = document.createElement('div');
rootEl.appendChild(postsEl);

api.getJSON('/posts', data => {
    rebuildList(postsEl, data);
}, error => {
    console.log(error);
});

function rebuildList(containerEl, items) {
    containerEl.innerHTML = '';
    for (const item of items) {
        const postEl = document.createElement('div');
        postEl.className = 'card mb-2';
        if (item.type === 'regular') {
            postEl.innerHTML = `
                <div class="card-body">
                    <div class="card-text">${item.content}</div>
                    <button class="btn">♡ ${item.likes}</button>
                    <button class="btn btn-primary" data-action="like">👍</button>
                    <button class="btn btn-danger" data-action="dislike">👎</button>
                    <button class="btn btn-light" data-action="delete">Удалить пост</button>
                </div>
            `;
        } else if (item.type === 'image') {
            postEl.innerHTML = `
                <img src="${item.content}" class="card-img-top"></img>
                <div class="card-body">
                    <button class="btn">♡ ${item.likes}</button>
                    <button class="btn btn-primary" data-action="like">👍</button>
                    <button class="btn btn-danger" data-action="dislike">👎</button>
                    <button class="btn btn-light" data-action="delete">Удалить пост</button>
                </div>
            `;
        } else if (item.type === 'audio') {
            postEl.innerHTML = `
                <audio src="${item.content}" class="embed-responsive embed-responsive-21by9 card-img-top" controls></audio>
                <div class="card-body">
                    <button class="btn">♡ ${item.likes}</button>
                    <button class="btn btn-primary" data-action="like">👍</button>
                    <button class="btn btn-danger" data-action="dislike">👎</button>
                    <button class="btn btn-light" data-action="delete">Удалить пост</button>
                </div>
            `;
        } else if (item.type === 'video') {
            postEl.innerHTML = `
                <video src="${item.content}" class="embed-responsive embed-responsive-16by9 card-img-top" controls></video>
                <div class="card-body">
                    <button class="btn">♡ ${item.likes}</button>
                    <button class="btn btn-primary" data-action="like">👍</button>
                    <button class="btn btn-danger" data-action="dislike">👎</button>
                    <button class="btn btn-light" data-action="delete">Удалить пост</button>
                </div>
            `;
        };

        postEl.querySelector('[data-action=delete]').addEventListener('click', function() {
            api.deleteJSON(`/posts/${item.id}`, null, data => {
                rebuildList(postsEl, data);
            }, error => {
                console.log(error);
            });
        });

        postEl.querySelector('[data-action=like]').addEventListener('click', function() {
            api.postJSON(`/posts/${item.id}/likes`, null, data => {
                rebuildList(postsEl, data);
            }, error => {
                console.log(error);
            });
        });
        postEl.querySelector('[data-action=dislike]').addEventListener('click', function() {
            api.deleteJSON(`/posts/${item.id}/likes`, null, data => {
                rebuildList(postsEl, data);
            }, error => {
                console.log(error);
            });
        });

        containerEl.appendChild(postEl);
    }
};

