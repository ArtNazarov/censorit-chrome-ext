function computeLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let length = 0; // Длина предыдущего наибольшего префикса
  let i = 1;

  while (i < pattern.length) {
      if (pattern[i] === pattern[length]) {
          length++;
          lps[i] = length;
          i++;
      } else {
          if (length !== 0) {
              length = lps[length - 1];
          } else {
              lps[i] = 0;
              i++;
          }
      }
  }

  return lps;
}

function kmpSearch(sMyString, sPattern) {
  const lps = computeLPS(sPattern);
  let i = 0; // Индекс для sMyString
  let j = 0; // Индекс для sPattern

  while (i < sMyString.length) {
      if (sPattern[j] === sMyString[i]) {
          i++;
          j++;
      }

      if (j === sPattern.length) {
          return true; // Найдена подстрока
      } else if (i < sMyString.length && sPattern[j] !== sMyString[i]) {
          if (j !== 0) {
              j = lps[j - 1];
          } else {
              i++;
          }
      }
  }

  return false; // Подстрока не найдена
}

function addLayer(){
// Create the layer element
const layer = document.createElement('div');

// Set the ID
layer.id = 'blank_screen_page';

// Set CSS properties
layer.style.position = 'fixed'; // Position it fixed to cover the viewport
layer.style.top = '0'; // Align to the top
layer.style.left = '0'; // Align to the left
layer.style.width = '100vw'; // Full width
layer.style.height = '100vh'; // Full height
layer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // Semi-transparent background
layer.style.backdropFilter = 'blur(10px)';
layer.style.zIndex = 9999;

// Append the layer to the body
document.body.appendChild(layer);
return layer;
}

function addInfo(title, message){
  // Create the layer element
  const layer = document.createElement('div');
  
  // Set the ID
  layer.id = 'information_page';
  
  // Set CSS properties
  layer.style.position = 'fixed'; // Position it fixed to cover the viewport
  layer.style.top = '0'; // Align to the top
  layer.style.left = '0'; // Align to the left
  layer.style.width = '100vw'; // Full width
  layer.style.height = '100vh'; // Full height
  layer.style.backgroundColor = '#000';
  layer.style.color = '#f00'; 
  layer.style.zIndex = 10000;
  layer.innerHTML = `<h1 style="text-align:center">${title}</h1><p>${message}</p>`;
  // Append the layer to the body
  document.body.appendChild(layer);
  return layer;
  }

function isAllowedHostName(whitelist){
  const hostName = window.location.hostname.toLowerCase();
  let domains = whitelist.toLowerCase().split("\n");
  let flag = false;
  for (let i=0;i<domains.length;i++){
    let someWhiteListDomain = domains[i].trim();
    flag = flag || (kmpSearch(hostName, someWhiteListDomain));
  };
  return flag;
} 

function isDocumentHasTag(tag) {
  // Приводим тег к нижнему регистру для регистронезависимого сравнения
  tag = tag.toLowerCase();

  // Проверяем, является ли тег подстрокой текущего домена
  if (kmpSearch( window.location.hostname.toLowerCase(), tag)) {
    return true;
  }

  // Проверяем, является ли тег подстрокой текущего URL
  if (kmpSearch(window.location.href.toLowerCase(), tag)) {
    return true;
  }

  // Получаем параметры URL в виде объекта
  const urlParams = new URLSearchParams(window.location.search);

  // Проверяем, является ли тег подстрокой одного из параметров или значений параметров
  for (const [key, value] of urlParams) {
    if (kmpSearch(key.toLowerCase(), tag) || kmpSearch(value.toLowerCase(), tag)) {
      return true;
    }
  }

  // Поиск по тексту
   const elements = document.querySelectorAll('*'); 
   for (let element of elements){
    if (kmpSearch(element.textContent.toLowerCase(), tag)){
      return true;
    }
   }

  

  // Если тег не найден нигде, возвращаем false
  return false;
}

 

/* SYNC OPTIONS */
/* Синхронизация с локальным хранилищем */

// Синхронизация тегов
chrome.runtime.sendMessage({method: "sync_tags"}, function(response) {
  console.log('Синхронизированы теги '+ response.tags);
  localStorage.setItem('tags',  response.tags);
});

// Синхронизация белого списка
chrome.runtime.sendMessage({method: "sync_whitelist"}, function(response) {
  console.log('Синхронизирован белый список '+ response.whitelist);
  localStorage.setItem('whitelist',  response.whitelist);
});
 

 

/* MAIN */

 

  

chrome.extension.sendMessage({}, function(response) {
 
  
  let layer = addLayer();
  
  
	var readyStateCheckInterval = setInterval(function() {
 
   


	if (document.readyState === "complete") {
		
    clearInterval(readyStateCheckInterval);
  
    
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("(C) CensorIt Nazarov A.A., 2024, Orenburg, Russia");
		console.log("Расширение готово к работе!");

                // ----------------------------------------------------------
  const whitelist = localStorage.getItem('whitelist');
  if (isAllowedHostName(whitelist)){
    console.log('Domain is whitelisted');
    layer.remove();
    clearInterval(readyStateCheckInterval);
    return;
  }
  
  console.log('Теги из локального хранилища = ' + localStorage.getItem('tags') );
  
  let tags =  localStorage.getItem('tags')  ;
   
  let arrTags = tags.split(/\r?\n/);  
 
  let flag = false;
  let foundedStr = "";
  for (let i=0;i<arrTags.length;i++){
    let tag = arrTags[i].trim();
    if (tag !== "" && isDocumentHasTag(tag)){
      console.log(`Тег ${tag} найден! `);
      foundedStr += " "+tag;
      flag = true;
    } else {
      console.log(`Тег ${tag} не найден... `);
    }
  }

  if (flag){
    document.body.innerHTML = '';
    addInfo("Заблокировано", "Найден(ы):" + foundedStr);
    let counter = 0;
    setInterval( function(){if (counter>3) { window.location.href = "http://0.0.0.0";}; counter++;}, 2000);
    
  } else {
    layer.remove();
  }
  
          
        }
    }
    , 1500);
  
 
  
  
}); 

 