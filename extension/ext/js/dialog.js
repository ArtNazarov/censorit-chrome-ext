const AdultUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/adult.txt';
const BetUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/gambling.txt';
const AlcoholUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/alcohol.txt';
const DatingUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/dating.txt';
const DrugsUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/drugs.txt';
const NuditityUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/nudity.txt';
const TobaccoUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/tobacco.txt';
const WearUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/wear.txt';
const AuctionUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/auctions.txt';
const PrisonUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/prison.txt';
const FraudUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/fraud.txt';
const WeaponUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/weapon.txt';
const NegativeUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/negatives.txt';
const HateUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/hate.txt';

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

document.getElementById('alcoholFilters').onclick = function(e){
  loadFromUrlToApp(AlcoholUrl);
}

document.getElementById('datingFilters').onclick = function(e){
  loadFromUrlToApp(DatingUrl);
}

document.getElementById('drugsFilters').onclick = function(e){
  loadFromUrlToApp(DrugsUrl);
}

document.getElementById('nudityFilters').onclick = function(e){
  loadFromUrlToApp(NuditityUrl);
}

document.getElementById('tobaccoFilters').onclick = function(e){
  loadFromUrlToApp(TobaccoUrl);
}

document.getElementById('wearFilters').onclick = function(e){
  loadFromUrlToApp(WearUrl);
}

document.getElementById('auctionFilters').onclick = function(e){
  loadFromUrlToApp(AuctionUrl);
}

document.getElementById('prisonFilters').onclick = function(e){
  loadFromUrlToApp(PrisonUrl);
}

document.getElementById('fraudFilters').onclick = function(e){
  loadFromUrlToApp(FraudUrl);
}

document.getElementById('weaponFilters').onclick = function(e){
  loadFromUrlToApp(WeaponUrl);
}

document.getElementById('negativeFilters').onclick = function(e){
  loadFromUrlToApp(NegativeUrl);
}

document.getElementById('hateFilters').onclick = function(e){
  loadFromUrlToApp(HateUrl);
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