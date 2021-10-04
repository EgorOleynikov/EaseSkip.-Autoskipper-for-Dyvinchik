console.log("background is running!");

window.addEventListener('storage', function(event){
    event.key == 'about' && event.newValue == '1' ? chrome.tabs.create({ url: chrome.runtime.getURL("../pages/welcome/welcomeEN.html") }) : 0;
});
