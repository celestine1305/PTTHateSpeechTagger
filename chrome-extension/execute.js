console.log("start :D");
var push = document.getElementsByClassName('push');
var token = "6879-005OkdwoeiT9JA6XP2XUxxugAaaSh4rQlq8RyUz-cy8";
  
var dict = {};

var ipRegex   = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
var timeRegex = /\d{1,2}\/\d{1,2} \d{1,2}\:\d{1,2}/;  
var idRegex = /\w*/;  

/** 新增標註文章的按鈕 */
var btn = document.createElement("button");
btn.innerHTML = "標註這篇文章";
if (document.getElementsByClassName('article-meta-tag').length >= 4 && document.getElementsByClassName('article-meta-tag')[3].textContent == "時間")
  document.getElementsByClassName('article-meta-value')[3].appendChild(btn);

// btn.setAttribute("style", "padding: 0px 10px 0px 10px;");
btn.addEventListener("click", function () {
  var texts = document.getElementsByClassName("article-meta-value");
  var author = texts[0].textContent.match(idRegex)[0];
  var title = texts[2].textContent;
  var time = texts[3].textContent;
  var yes = window.confirm("標記此篇文章為仇恨言論？\n" + 
                           ">> 作者：" + author + "\n" +
                           ">> 標題：" + title );
  var ip = document.getElementsByClassName("f2")[0].textContent.match(ipRegex)[0];
  if (yes) {
      var data = {"id": author, 
                  "content": title,
                  "ip": ip, 
                  "time": time}
      var text = JSON.stringify(data);
      postHypothesis(text, title, 'aritcle');
  }
});



/** Define POST method */
const postHypothesis = function (text, quoted, type) {
  var xhr = new XMLHttpRequest();
  var url = 'https://api.hypothes.is/api/annotations';
  var data = {
    "uri": document.URL,
    "document": { "title": ["PTTHateSpeechTagger"]},
    "text": text,
    "link": [
        { "href": "https://h.readthedocs.io/en/latest/api-reference/v2/#tag/annotations/paths/~1annotations/post"}
    ],
    "tags": ['ptt', type],
    'group': '__world__',
    'permissions': {
        'read': ['group:__world__']
    },
    'target': [{
        'source': document.URL,
        'selector': [
            {
                'type': 'TextQuoteSelector',
                'exact': quoted
            }
        ]
    }]
  }
  chrome.storage.sync.get('token', (res) => {  
    if (res.token != undefined) token = res.token;
    console.log("TOKEN: "+token);
  });
  var jsondata = JSON.stringify(data);
  var error = false;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer "+token);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json);
      }
      else if (xhr.status != 200 && error == false) {
        error = true;
        alert("標註失敗，請重新輸入 Token 並重新整理一次。");
      }
  };
  xhr.send(jsondata)
}


/** Define mouse event of ptt.cc website */
var mouseOverFunction = function () {
  id = this.getElementsByClassName('f3 hl push-userid')[0].textContent;
  dict[id].forEach(function(item, index, array) {
    push[item].setAttribute("style", "background-color: rgba(255, 255, 255, 0.20);");
  });
  this.setAttribute("style", "background-color: rgba(255, 255, 116, 0.30);"); // your colour change
};
var mouseOutFunction = function () {
  id = this.getElementsByClassName('f3 hl push-userid')[0].textContent;
  dict[id].forEach(function(item, index, array) {
    push[item].setAttribute("style", "background-color: initial;");
  });
};
var mouseClickFunction = function () {
  var yes = window.confirm("標記此推文為仇恨言論？\n >> " + this.getElementsByClassName('f3 hl push-userid')[0].textContent + this.getElementsByClassName('f3 push-content')[0].textContent);
  if (yes) {
      
      var content = this.getElementsByClassName('f3 push-content')[0].textContent;
      var iptime = this.getElementsByClassName('push-ipdatetime')[0].textContent;
      var ip = iptime.match(ipRegex)[0];
      var time = iptime.match(timeRegex)[0];
      var data = {"id": this.getElementsByClassName('f3 hl push-userid')[0].textContent, 
                  "content": content.slice(content.indexOf(" ")+1),
                  "ip": ip, 
                  "time": time}
      var text = JSON.stringify(data);
      console.log("POST:\n" + text);
      postHypothesis(text, this.textContent, 'push');
  }
}

/** Difine disable/enable ptt tagger tool Function */
const enableTagger = () => {
  console.log("Enable");

  // var push = document.getElementsByClassName('push');
  // var content = document.getElementsByClassName('f3 push-content')
  btn.style.display = "inline";
  for (var i=0; i < push.length; ++i) {
      push[i].onmouseover = mouseOverFunction;
      push[i].onmouseout  = mouseOutFunction;
      push[i].onclick = mouseClickFunction;
      // push[i].style.cursor = "pointer";
  }
};
const disableTagger = () => {
  console.log("Disable");
  for (var i=0; i < push.length; ++i) {
    push[i].onmouseover = null;
    push[i].onmouseout  = null;
    push[i].onclick = null;
    btn.style.display = "none";
  }
}
const changeToken = () => {
  console.log("Change Token");
  chrome.storage.sync.get('token', (res) => {  
    token = res.token;
    console.log(token);
  });
}

/** Difine event handler of popup */
const onMessage = (message) => {
  switch (message.action) {
    case 'ENABLE':
      enableTagger();
      break;
    case 'DISABLE':
      disableTagger();
      break;
    case 'CHANGETOKEN':
      changeToken();
      break;
    default:
      break;
  }
}

/** Load previous setting (enable/disable the tool, API token) */
chrome.storage.sync.get('enabled', (res) => {  
  if (res.enabled == undefined) {
    chrome.storage.sync.set({enabled: false}, () => {
      console.log('first setting enabled key value!');
      disableTagger();
    });
  }
  else if (res.enabled) enableTagger();
  else disableTagger();
});

chrome.storage.sync.get('token', (res) => {  
  if (res.token != undefined) token = res.token;
  console.log("TOKEN: "+ token);
});

/** organize push content by ID */
for (var i = 0; i < push.length; i++) {
  var id = push[i].getElementsByClassName("f3 hl push-userid")[0].textContent;
  if (id in dict == false)  dict[id] = [];
  dict[id].push(i);
}



chrome.runtime.onMessage.addListener(onMessage);