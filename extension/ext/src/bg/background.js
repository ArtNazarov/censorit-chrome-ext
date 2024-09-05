 
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
   switch(request) {
    case 'request_words' : {
        chrome.tabs.create({
            url: chrome.extension.getURL('dialog.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
                // incognito, top, left, ...
            });
        });
    break;}
    default : {
      
       if (request.method == "sync_tags"){
              console.log('send to inject.js...');
              sendResponse({tags: localStorage.getItem('tags')});
      }
      else
      sendResponse();
    }
  };}
);
function setTags(tags) {
    localStorage.setItem('tags', tags );
};

 