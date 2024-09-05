const adultFilters = [
'xxx',
'porn'
];

document.getElementById('adultFilters').onclick = function(e){
  for(let tag of adultFilters){
    document.getElementById("tags").value =  document.getElementById("tags").value + "\r\n" + tag;
  }
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