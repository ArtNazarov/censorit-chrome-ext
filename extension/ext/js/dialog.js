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
const MysticUrl = 'https://raw.githubusercontent.com/ArtNazarov/censorit-chrome-ext/main/blocklist_keywords/mystic.txt';

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

document.getElementById('mysticFilters').onclick = function(e){
  loadFromUrlToApp(MysticUrl);
}


function makeFormsVisibleByState(stateOfDialog){
  if (stateOfDialog == "UNLOCKED" || stateOfDialog == null){
    document.getElementById("main_form").style.display = "block";
    document.getElementById("password_unlock_form").style.display = "none";
  } else {
   document.getElementById("main_form").style.display = "none";
   document.getElementById("password_unlock_form").style.display = "block";
  }
}

document.getElementById("password_unlock_form").onsubmit = function(e) {
  e.preventDefault(); // Prevent submission
  let password = document.getElementById("password").value;
  chrome.runtime.getBackgroundPage(function(bgWindow) {
    // sync values with inject.js storage
      const expectedPassword =  localStorage.getItem("password");
      console.log("Введен пароль", password);
      console.log("Ожидается пароль", localStorage.getItem("password"));
      if (password == expectedPassword || expectedPassword === null ){
          let stateOfDialog = "UNLOCKED";
          makeFormsVisibleByState(stateOfDialog);
          bgWindow.setState(stateOfDialog);
      }
  });
};


document.getElementById("main_form").onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    let tags = document.getElementById('tags').value;
    let whitelist = document.getElementById('whitelist').value;

    chrome.runtime.getBackgroundPage(function(bgWindow) {
      console.log(bgWindow);
      // sync values with inject.js storage
        bgWindow.setTags(tags);
        bgWindow.setWhiteList(whitelist);
        console.log('Options saved');
        let stateOfDialog = "LOCKED";
        bgWindow.setState(stateOfDialog);
        makeFormsVisibleByState(stateOfDialog);
        // window.close();     // Close dialog
    });
};



document.addEventListener("DOMContentLoaded", function(){
  const tags = localStorage.getItem('tags'); // get tags from localStorage
  const whitelist = localStorage.getItem('whitelist'); // get whitelist from localStorage
  let stateOfDialog = localStorage.getItem('stateOfDialog'); // get state of dialog (e.g. "LOCKED" or "UNLOCKED")
  if (stateOfDialog == null){
    stateOfDialog = "UNLOCKED"; // first run
  };
  makeFormsVisibleByState(stateOfDialog);
  
  let passwordOfDialog = localStorage.getItem('password'); 
   console.log(  tags  );
   console.log( whitelist);
   console.log( stateOfDialog);
   console.log( passwordOfDialog);
   // set UI values from localStorage
   document.getElementById('tags').value = localStorage.getItem('tags');
   document.getElementById('whitelist').value = localStorage.getItem('whitelist');
   document.getElementById('state').value = stateOfDialog;
   if (passwordOfDialog == null) passwordOfDialog='';
   document.getElementById('password1').value = passwordOfDialog;
   document.getElementById('password2').value = passwordOfDialog;

   
 });


 document.getElementById("btnSetPassword").onclick = function(e){
  console.log("Изменение пароля");
  const password1 = document.getElementById("password1").value;
  const password2 = document.getElementById("password2").value;
  if (password1 == password2){
    chrome.runtime.getBackgroundPage(function(bgWindow) {
      bgWindow.setPassword(password1);
      console.log('Установлен пароль', password1);
    });
  };  
 };