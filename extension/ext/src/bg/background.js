// Saves tags (multirow) to local storage
function setTags(tags) {
    localStorage.setItem('tags', tags );
};
// Saves whitelist (multirow) to local storage
function setWhiteList(whitelist) {
    localStorage.setItem('whitelist', whitelist);
};
// Saves dialog state to local storage
function setState(stateOfDialog){
    localStorage.setItem("stateOfDialog", stateOfDialog);
}
// Saves password to local storage
function setPassword(password){
    localStorage.setItem("password", password);
}


// Запрос на получение белого списка
function onReqWhiteList(request, sender, sendResponse){
    if (request.method != "sync_whitelist") return;
        
    console.log('send to inject.js...');
    sendResponse({whitelist: localStorage.getItem('whitelist')});
    return true;   
}

// Запрос на получение тегов
function onReqTags(request, sender, sendResponse){ 
    if (request.method != "sync_tags") return;
        
    console.log('send to inject.js...');
    sendResponse({tags: localStorage.getItem('tags')});
    return true;
} 

// Запрос на получение пароля
function onReqPassword(request, sender, sendResponse){ 
    if (request.method != "sync_password") return;
        
    console.log('send to inject.js...');
    sendResponse({password: localStorage.getItem('password')});

    return true;
} 

// Запрос на получение состояния диалога
function onReqState(request, sender, sendResponse){ 
    if (request.method != "sync_state") return;
        
    console.log('send to inject.js...');
    sendResponse({state: localStorage.getItem('stateOfDialog')});
    return true;
} 




// Запрос по умолчанию
function defRequest(request, sender, sendResponse){
      sendResponse();
      return true;
}

function onWordRequest(request, sender, sendResponse){
    if (request != 'request_words') return;
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
}


chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    let flag = false;
    try {
        flag = flag || onWordRequest(request, sender, sendResponse);
        flag = flag || onReqTags(request, sender, sendResponse);
        flag = flag || onReqWhiteList(request, sender, sendResponse);
        flag = flag || onReqState(request, sender, sendResponse);
        flag = flag || onReqPassword(request, sender, sendResponse);
        if (!flag) defRequest(sendResponse);
    } catch (err) {
        console.log(err);
    };
  }
);

