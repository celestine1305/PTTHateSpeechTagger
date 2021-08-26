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

function submit() {
    const id = document.getElementById("searchinput").value;

    let url = new URL('http://192.168.8.99:3000/rank'),
        params = { id: id }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    postData(url)
        .then(data => {
            const result = data.rank
            console.log(result);
            if (Object.keys(result).length === 0) {
                console.log("here");
                var dt = [["帳號", "數量",]];
                dt.push(["NO DATA", 0])
                console.log(dt);
                drawChart(dt);
            }
            else {
                let dt = [["帳號", "數量",]];
                for (var d in result) {
                    console.log(d)
                    dt.push([result[d]["id"], result[d]["cnt"]]);
                }
                console.log(dt)
                drawChart(dt);
            }
        })
        .catch(error => console.error(error))
}


google.charts.load('current', { packages: ['corechart', 'bar'] });
google.charts.setOnLoadCallback(drawChart);
submit()

function drawChart(dt) {

    var chart_data = google.visualization.arrayToDataTable(dt);

    var options = {
        // chartArea: { width: '70%', height: "80%"},
        colors: ['#444'],
        backgroundColor: "#f5f5f5",
        height: 300,
        hAxis: {
            minValue: 0,
            baseline: 0,
            baselineColor: "#444",
            format: '#',
            viewWindowMode: 'explicit',
            viewWindow: {
                min: 0
            },
            textStyle: { color: "#444"}
        },
        vAxis: {
            textStyle: { color: "#444" }
        },
        legend: {
            position: 'none'
        },
        tooltip: {
            trigger: 'selection',
        },
        fontName: "Open+Sans"
    };

    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.setAction({
        id: 'search',
        text: '查詢此帳號',
        action: function() {
            console.log(chart.getSelection()[0].row)
            console.log(dt[chart.getSelection()[0].row+1][0])
            sel_id = dt[chart.getSelection()[0].row + 1][0]
            window.location.href = './search.html?id='+sel_id;
        }
    })
    chart.draw(chart_data, options);

}