const baseUrl = 'http://localhost:9999';

const rootEl = document.getElementById('root');
rootEl.innerHTML = `
    <ul data-id="messages"></ul>
    <form data-id="message-form">
      <input data-id="message-text">
      <button>Send</button>
    </form>
`;

const messagesEl = rootEl.querySelector('[data-id=messages]');
const messageFormEl = rootEl.querySelector('[data-id=message-form]');
const messageInputEl = messageFormEl.querySelector('[data-id=message-text]');

let lastSeendId = 0;

// если у стрелочной функции всего один аргумент, то круглые скобки вокруг можно не писать
messageFormEl.addEventListener('submit', ev => {
    ev.preventDefault();

    const { value } = messageInputEl; // const value = messageInputEl.value

    const messageEl = document.createElement('li');
    messageEl.textContent = value;
    messageEl.classList.add('sending');
    messagesEl.appendChild(messageEl);

    // Promise
    fetch(`${baseUrl}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: 0,
            content: value,
        }),
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // отправилось
        messagesEl.removeChild(messageEl);
    }).catch(error => {
        // TODO: повторная отправка
    })
    ;

    messageInputEl.value = '';

});

// setTimeout -> единоразово
// setInterval -> многоразово

function renderMessages(messages) {
    for (const message of messages) {
        const messageEl = document.createElement('li');
        messageEl.textContent = message.content;
        messagesEl.appendChild(messageEl);
    }
}

// Promise -> pending
// Всего один раз может из состояния pending перейти в fullfilled/rejected
setInterval(() => {
    // GET-запрос
    const promise = fetch(`${baseUrl}/messages/${lastSeendId}`);
    // Если из функции, которая передана в then возвращается Promise, то его можно обработать в следующем then
    // Если Promise reject'иться с ошибкой, то ошибку можно перехватить в catch (при этом все then'ы до catch пропускаются)
    promise.then(response => {
        if (!response.ok) {
            // потому что дальше ответ обработать не можем
            throw new Error(response.statusText);
        }
        return response.json(); // новый Promise
    }).then(data => {
        console.log(data);
        if (data.length !== 0) {
            lastSeendId = data[data.length - 1].id;
            renderMessages(data);
        }
    }).catch(error => {
        console.log(error);
    })
        ;

    // callback hell
    // promise.then(
    //     response => {
    //         // >= 200, < 300
    //         if (!response.ok) {
    //             return;
    //         }
    //         // console.log(response.body);
    //         response.json()
    //             .then(
    //                 data => {
    //                     console.log(data);
    //                 }, reason => {
    //                     console.log(reason);
    //                 }
    //             );
    //     },
    //     reason => { console.log(reason); }
    // );
}, 500); // 5000 ms -> 5 s
