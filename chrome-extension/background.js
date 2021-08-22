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
      var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
      
      if (res.enabled == undefined) console.log("wait a minute...");
      else isChecked = res.enabled;
    
      toggle.checked = isChecked;
      
      if (isChecked) sendMessage({ action:'ENABLE' });
      else sendMessage({ action:'DISABLE' })
    });
  
    
    // var s = document.getElementsByClassName('slider round')[0];
    // toggle.disabled = true;
    // s.style.cursor = 'default';
  
    toggle.addEventListener('click', () => clickToggle(tabId));
  
  }
  chrome.tabs.getSelected(null, getSelectedTab);