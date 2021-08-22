var isChecked = false;
var toggle = document.getElementById('toggle');


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

  
  // var s = document.getElementsByClassName('slider round')[0];
  // toggle.disabled = true;
  // s.style.cursor = 'default';
  
  toggle.addEventListener('click', () => clickToggle(tabId));

}
chrome.tabs.getSelected(null, getSelectedTab);