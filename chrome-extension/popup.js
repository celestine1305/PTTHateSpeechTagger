var isChecked = false;
var toggle = document.getElementById('toggle');
var tokenButton = document.getElementById('token');
var resetButton = document.getElementById('resettoken');
var websiteButton = document.getElementById('website');
var tutorialButton = document.getElementById('tutorial');

var clickTutorial = function () {
  var newURL = "https://www.csie.ntu.edu.tw/~b07902010/PTTHateSpeechTagger/tutorial.html";
  chrome.tabs.create({ url: newURL });
}

var clickWebsite = function () {
  var newURL = "https://www.csie.ntu.edu.tw/~b07902010/PTTHateSpeechTagger/";
  chrome.tabs.create({ url: newURL });
}

var resetToken = function (tabId) {
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
  let newtoken = "6879-005OkdwoeiT9JA6XP2XUxxugAaaSh4rQlq8RyUz-cy8";
  if (newtoken != null && newtoken != "") {
    chrome.storage.sync.set({token: newtoken}, () => {
      console.log('setting new api token!');
    });
    sendMessage({ action:'CHANGETOKEN' });
  }
  alert("Reset to default token.")
}

var clickToken = function (tabId) {
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
  var newtoken = prompt('Enter your new Hypothesis API Token');
  console.log(newtoken);
  if (newtoken != null && newtoken != "") {
    chrome.storage.sync.set({token: newtoken}, () => {
      console.log('setting new api token!');
    });
    sendMessage({ action:'CHANGETOKEN' });
  }
}

var clickToggle = function (tabId) {
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
  isChecked = !isChecked;
  chrome.storage.sync.set({enabled: isChecked}, () => {
    console.log('toggle is clicked!');
  });
  if (isChecked) sendMessage({ action:'ENABLE' });
  else sendMessage({ action:'DISABLE' })
};

var getSelectedTab = (tab) => {
  var tabId = tab.id;
  
  chrome.storage.sync.get('enabled', (res) => {
    if (res.enabled == undefined) {
      chrome.storage.sync.set({enabled: false}, () => {
        console.log('first setting enabled key value!');
      });
    }
    else isChecked = res.enabled;
    toggle.checked = isChecked;
  });
  
  toggle.addEventListener('click', () => clickToggle(tabId));
  tokenButton.addEventListener('click', () => clickToken(tabId));
  tutorialButton.addEventListener('click', () => clickTutorial());
  websiteButton.addEventListener('click', () => clickWebsite());
  resetButton.addEventListener('click', () => resetToken(tabId));
  

}
chrome.tabs.getSelected(null, getSelectedTab);