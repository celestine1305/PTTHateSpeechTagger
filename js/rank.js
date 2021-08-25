function postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'user-agent': 'Example',
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
        .then(response => response.json()) // 輸出成 json
}

function submit() {
    const id = document.getElementById('id').value;
    console.log(id);
    const data = {
        id
    }

    postData('http://192.168.8.99:3000/rank', data)
        .then(data => {
            const result = data.rank
            console.log(data.rank);
            document.getElementById('ranking').innerHTML = JSON.stringify(result);
        })
        .catch(error => console.error(error))
}
