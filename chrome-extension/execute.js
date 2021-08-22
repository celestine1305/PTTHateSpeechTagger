console.log("start :D");
var push = document.getElementsByClassName('push');


/** Define POST method */
const postHypothesis = function (text, quoted) {
  var xhr = new XMLHttpRequest();
  var url = 'https://api.hypothes.is/api/annotations';
  // var data = {
  //   uri: document.URL,
  //   document: { "title": ["TESTING"]},
  //   text: text,
  //   tags: ["ptt"],
  //   link: [
  //       { "href": "https://h.readthedocs.io/en/latest/api-reference/v2/#tag/annotations/paths/~1annotations/post"}
  //   ]
  // }
  var data = {
    "uri": document.URL,
    "document": { "title": ["references"]},
    "text": text,
    "link": [
        { "href": "https://h.readthedocs.io/en/latest/api-reference/v2/#tag/annotations/paths/~1annotations/post"}
    ],
    'group': '__world__',
    'permissions': {
        'read': ['group:__world__'],
        'admin': ['acct:celestine1305@hypothes.is'],
        'update': ['acct:celestine1305@hypothes.is'],
        'delete': ['acct:celestine1305@hypothes.is']
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

  var json = JSON.stringify(data);
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer 6879-1DT-iEA0raktuundhJukwUXNNe4k6xeo7wG8EArqVng");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json);
      }
  };
  xhr.send(json)
}


/** Define mouse event of ptt.cc website */
var mouseOverFunction = function () {
  this.setAttribute("style", "background-color: rgba(255, 255, 116, 0.30);"); // your colour change
};
var mouseOutFunction = function () {
  this.setAttribute("style", "background-color: initial;");
};
var mouseClickFunction = function () {
  var yes = window.confirm("標記此推文為仇恨言論？\n >> " + this.getElementsByClassName('f3 hl push-userid')[0].textContent + this.getElementsByClassName('f3 push-content')[0].textContent);
  if (yes) {
      var text = " [User-ID] " + this.getElementsByClassName('f3 hl push-userid')[0].textContent
               + " [Content] " + this.getElementsByClassName('f3 push-content')[0].textContent
               + " [IP&Time] " + this.getElementsByClassName('push-ipdatetime')[0].textContent;
      console.log("POST:\n" + text);
      postHypothesis(text, this.textContent);
  }
}


/** Difine disable/enable ptt tagger tool Function */
const enableTagger = () => {
  console.log("Enable");

  // var push = document.getElementsByClassName('push');
  // var content = document.getElementsByClassName('f3 push-content')

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
  }
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
    case 'CLICK':

    default:
      break;
  }
}

/** Load previous setting (enable/disable the tool) */
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

chrome.runtime.onMessage.addListener(onMessage);
