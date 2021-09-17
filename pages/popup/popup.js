const startButton = document.getElementById("pupup-start-button");
const stopButton = document.getElementById("popup-stop-button");
const ageInput = document.getElementById("ageInput").value;

ageInput.oninput = function() { // counter logick
    if (this.value > 99) {this.value = 99};
    if (this.value < 15) {this.value = 15}
}

var htmlStates = { // sends as message
    state: false,
    ageInput: ageInput
}

function letter(htmlStates) { // принимает объект состояний кнопок
    let params = {
        active: true,
        lastFocusedWindow: true
    }
    chrome.tabs.query(params, init); 
    function init(tabs){
        htmlStates.url = tabs[0].url;
        chrome.tabs.sendMessage(tabs[0].id, htmlStates);
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
