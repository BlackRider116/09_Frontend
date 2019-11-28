const baseUrl = 'https://backend-09-server.herokuapp.com';
// const baseUrl = 'http://localhost:9999';

let firstSeenId = 0;
let lastSeenId = 0;
console.log(lastSeenId)

const rootEl = document.getElementById('root');

const addFormEl = document.createElement('form');
addFormEl.innerHTML = `
<form>
  <div class="form-row">
    <div class="col-7">
    <input class="form-control" placeholder="Введите текст или url" data-id="link">
    </div>
    <select class="col" data-id="type">
            <option value="regular">Обычный</option>
             <option value="image">Изображение</option>
             <option value="audio">Аудио</option>
            <option value="video">Видео</option>
    </select>
    <button class="btn btn-primary">Добавить</button>
  </div>
</form>
`;

rootEl.appendChild(addFormEl);

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
    fetch(`${baseUrl}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    }).then(data => {
        linkEl.value = '';
        typeEl.value = 'regular';
        localStorage.clear();
        rebuildList(postsEl, data.reverse());
    }).catch(error => {
        console.log(error)
    });
});


const postsEl = document.createElement('div');
rootEl.appendChild(postsEl);

// const promise = fetch(`${baseUrl}/posts`);
// promise.then(response => {
//     if (!response.ok) {
//         throw new Error(response.statusText);
//     }
//     return response.json();
// }).then (data => {
//     rebuildList(postsEl, data.reverse());
// }).catch(error => {
//     console.log(error)
// });

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
                    <button class="btn">id: ${item.id}</button>
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
                    <button class="btn">id: ${item.id}</button>
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
                    <button class="btn">id: ${item.id}</button>
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
                    <button class="btn">id: ${item.id}</button>
                </div>
            `;
        };

        postEl.querySelector('[data-action=delete]').addEventListener('click', function () {
            fetch(`${baseUrl}/posts/${item.id}`, {
                method: 'DELETE',
                   }).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then(data => {
                rebuildList(postsEl, data.reverse());
            }).catch(error => {
                console.log(error)
            });
        });
     
        postEl.querySelector('[data-action=like]').addEventListener('click', function () {
            fetch(`${baseUrl}/posts/${item.id}/likes`, {
                method: 'POST',
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then(data => {
                rebuildList(postsEl, data.reverse());
            }).catch(error => {
                console.log(error)
            });
        });

        postEl.querySelector('[data-action=dislike]').addEventListener('click', function () {
            fetch(`${baseUrl}/posts/${item.id}/likes`, {
                method: 'DELETE',
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then(data => {
                rebuildList(postsEl, data.reverse());
            }).catch(error => {
                console.log(error)
            });
        });
        containerEl.appendChild(postEl);
    }
};

const lastPosts = document.createElement('button');
lastPosts.className = 'btn btn-primary d-block mx-auto mt-2';
lastPosts.innerHTML = 'Показать еще посты';
lastPosts.addEventListener('click', function () {
    fetch(`${baseUrl}/posts/${lastSeenId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    }).then(data => {
        // console.log(data.length)
        if (data.length !== 0) {
            lastSeenId = data[data.length - 1].id;
            rebuildList(postsEl, data.reverse())
            // console.log(lastSeenId)
        }
    }).catch(error => {
        console.log(error);
    });
})
rootEl.appendChild(lastPosts);



// function lastPost() {
//     fetch(`${baseUrl}/posts/${lastSeenId}`)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(response.statusText);
//         }
//         return response.json();
//     }).then(data => {
//         if (data.length !== 0) {
//             lastSeenId = data[data.length - 1].id;
//             rebuildList(postsEl, data.reverse())
//             // console.log(lastSeenId)
//         }
//     }).catch(error => {
//         console.log(error);
//     });
// };


