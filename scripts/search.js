function postData(url) {
    // Default options are marked with *
    return fetch(url, {
        // body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'user-agent': 'Example',
            'content-type': 'application/json'
        },
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
        .then(response => response.json()) // 輸出成 json
}

let url = location.href;
if (url.indexOf('?') != -1) {
    let qid = url.split('?')[1].split('&')[0].split('=')[1]
    console.log(qid)
    document.getElementById('searchinput').value = qid;
    submit();
}

let searchinput = document.getElementById("searchinput");
searchinput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchbutton.click();
    }
});

function submit() {
    const id = document.getElementById('searchinput').value;

    let url = new URL('http://192.168.8.99:3000/search'),
        params = { id: id}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    postData(url)
        .then(data => {
            console.log(data);
            // document.getElementById('comment').innerHTML = JSON.stringify(result);
            let result = document.getElementById("result");
            if (id) {
                IdHtml = "<h3>" + id + " 的推文紀錄</h3>";
                result.innerHTML = IdHtml;
            }
            for (var i = 0; i < data["count"]; i++) {
                let pushelement = document.createElement("button");
                let PushHtml = "<a class=\"push-content\" style='float:left'>" + data["data"][i]["content"] + "<\a>" +
                    "<a class=\"push-ip-time\" style='float:right'>" + data["data"][i]["ip"] + "    " + data["data"][i]["time"] + "<\a>";
                pushelement.innerHTML = PushHtml;
                pushelement.className = "push";
                let url = data["data"][i]["url"];
                pushelement.addEventListener('click', function () {
                    // location.href = url;
                    window.open(url, '_blank');
                });
                console.log(data["data"][i]["url"]);
                result.appendChild(pushelement);
            }
        })
        .catch(error => console.error(error))
}