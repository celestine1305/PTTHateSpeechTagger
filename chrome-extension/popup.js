var isChecked = false;
var toggle = document.getElementById('toggle');
var tokenButton = document.getElementById('token');
var websiteButton = document.getElementById('website');
var tutorialButton = document.getElementById('tutorial');

var clickTutorial = function () {
  var newURL = "https://www.netflix.com/";
  chrome.tabs.create({ url: newURL });
}

var clickWebsite = function () {
  var newURL = "https://www.netflix.com/";
  chrome.tabs.create({ url: newURL });
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

}
chrome.tabs.getSelected(null, getSelectedTab);