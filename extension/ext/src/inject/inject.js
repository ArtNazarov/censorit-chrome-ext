 
    
function isDocumentHasTag(tag) {
  // Приводим тег к нижнему регистру для регистронезависимого сравнения
  tag = tag.toLowerCase();

  // Проверяем, является ли тег подстрокой текущего домена
  if (window.location.hostname.toLowerCase().includes(tag)) {
    return true;
  }

  // Проверяем, является ли тег подстрокой текущего URL
  if (window.location.href.toLowerCase().includes(tag)) {
    return true;
  }

  // Получаем параметры URL в виде объекта
  const urlParams = new URLSearchParams(window.location.search);

  // Проверяем, является ли тег подстрокой одного из параметров или значений параметров
  for (const [key, value] of urlParams) {
    if (key.toLowerCase().includes(tag) || value.toLowerCase().includes(tag)) {
      return true;
    }
  }

  // Получаем HTML код страницы
  const pageHTML = document.documentElement.outerHTML;

  // Проверяем, содержится ли тег в HTML коде страницы
  if (pageHTML.toLowerCase().includes(tag)) {
    return true;
  }

  // Если тег не найден нигде, возвращаем false
  return false;
}

 

/* SYNC OPTIONS */
/* Синхронизация с локальным хранилищем */

chrome.runtime.sendMessage({method: "sync_tags"}, function(response) {
  console.log('Синхронизированы теги '+ response.tags);
  localStorage.setItem('tags',  response.tags);
});
 

 

/* MAIN */
 

  

chrome.extension.sendMessage({}, function(response) {
 
  

  
  
	var readyStateCheckInterval = setInterval(function() {
    
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("(C) CensorIt Nazarov A.A., 2024, Orenburg, Russia");
		console.log("Расширение готово к работе!");

                // ----------------------------------------------------------
  
 
  
  console.log('Теги из локального хранилища = ' + localStorage.getItem('tags') );
  
  let tags =  localStorage.getItem('tags')  ;
   
  let arrTags = tags.split(/\r?\n/);  
 
  let flag = false;
  
  for (let i=0;i<arrTags.length;i++){
    let tag = arrTags[i];
    if (isDocumentHasTag(tag)){
      console.log(`Тег ${tag} найден! `);
      // redirect!
      window.location.href = "http://0.0.0.0";
    } else {
      console.log(`Тег ${tag} не найден... `);
    }
  }

 
   
    
          
       
	
          
        }
    }
    , 3000);
  
 
  
  
}); 

 