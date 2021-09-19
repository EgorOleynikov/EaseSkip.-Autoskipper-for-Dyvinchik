const startButton = document.getElementById("pupup-start-button");
const stopButton = document.getElementById("popup-stop-button");
const ageInput = document.getElementById("ageInput");
const delayInput = document.getElementById("delayInput");
const delayInputNum = document.querySelector("#delayInputNum");

ageInput.oninput = () => { // counter logick
    if (ageInput.value.length < 2) {ageInput.value = 15};
}

delayInput.oninput = () => { // delay logick
    delayInputNum.innerText = delayInput.value;
}

function letter(buttState) { // accepts buttons states object
    var htmlStates = { // sends as message
        state: buttState,
        ageInput: ageInput.value,
        delayInput: delayInput.value * 1000,
        url: null
    };
    let params = {
        active: true,
        lastFocusedWindow: true
    };
    chrome.tabs.query(params, init); 
    function init(tabs) {
        htmlStates.url = tabs[0].url;
        chrome.tabs.sendMessage(tabs[0].id, htmlStates);
    }
}

chrome.runtime.onMessage.addListener(letter);

startButton.onclick = () => {
    letter(true)
};
stopButton.onclick = () => {
    letter(false)
};
