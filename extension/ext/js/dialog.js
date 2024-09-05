const AdultUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/adult.txt';
const BetUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/gambling.txt';

async function getLines(url) {
  try {
      // Получаем ответ от сервера
      const response = await fetch(url);
      
      // Проверяем, успешен ли ответ
      if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      // Получаем текст ответа
      const text = await response.text();

      // Разделяем текст на строки и возвращаем массив
      return text.split('\n');
  } catch (error) {
      console.error('Ошибка при получении данных:', error);
      return []; // Возвращаем пустой массив в случае ошибки
  }
}


function addFilterFromArr(arr){
  console.log('Добавляем на форму');
  console.log(arr);
  for(let tag of arr){
    document.getElementById("tags").value =  document.getElementById("tags").value + "\r\n" + tag;
  }
}

function loadFromUrlToApp(url){
  getLines(url)
  .then(lines => {
      console.log('Фильтры из файла:', lines);
      addFilterFromArr(lines);
  })
  .catch(error => {
      console.error('Ошибка:', error);
  });
  
}

document.getElementById('adultFilters').onclick = function(e){
  loadFromUrlToApp(AdultUrl);
}

document.getElementById('betFilters').onclick = function(e){
  loadFromUrlToApp(BetUrl);
}


document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    let tags = document.getElementById('tags').value;

    chrome.runtime.getBackgroundPage(function(bgWindow) {
      // sync values with inject.js storage
        bgWindow.setTags(tags);
        console.log('Options saved');
        window.close();     // Close dialog
    });
};

document.addEventListener("DOMContentLoaded", function(){
    // set UI values from localStorage
   console.log(   localStorage.getItem('tags') );
   document.getElementById('tags').value =   localStorage.getItem('tags');
 });