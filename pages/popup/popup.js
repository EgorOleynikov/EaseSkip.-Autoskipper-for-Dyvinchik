const startButton = document.getElementById("pupup-start-button");
const stopButton = document.getElementById("popup-stop-button");
const ageInput = document.getElementById("ageInput");

ageInput.oninput = function() { // counter logick
    if (this.value > 99) {this.value = 99};
    if (this.value < 15) {this.value = 15}
}

var htmlStates = { // sends as message
    state: false
}

function letter(htmlStates) { // принимает объект состояний кнопок
    let params = {
        active: true,
        lastFocusedWindow: true
    }
    chrome.tabs.query(params, init); 
    function init(tabs){
        let message = {
            state: htmlStates.state,
            url: tabs[0].url
        }
        chrome.tabs.sendMessage(tabs[0].id, message);
    }
}

startButton.onclick = function() {
    htmlStates.state = true;
    letter(htmlStates)
};
stopButton.onclick = function() {
    htmlStates.state = false;
    letter(htmlStates)
};
