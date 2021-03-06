// init

const toggleBox = document.getElementById("toggleBox");
const minAgeInput = document.getElementById("minAgeInput");
const maxAgeInput = document.getElementById("maxAgeInput");
const delayInput = document.getElementById("delayInput");
const delayInputNum = document.querySelector("#delayInputNum");
const myChart = document.getElementById("myChart").getContext('2d');
const counterNum = document.getElementById("counterNum");
const resetBtn = document.getElementById("resetBtn");
const idModeBox = document.getElementById("idModeBox");
const authorBtn = document.getElementById("authorBtn");
const aboutBtn = document.getElementById("aboutBtn");
const langBtn = document.getElementById("langBtn");
var state = '0';
localStorage.getItem('state') == '1' ? toggleBox.checked = true : toggleBox.checked = false;
localStorage.getItem('idState') == '1' ? idModeBox.checked = true : idModeBox.checked = false;

var htmlStates = {
    state: null,
    minAgeInput: null,
    maxAgeInput: null,
    delayInput: null,
    url: null
};

chrome.storage.local.get(['minAgeInput', 'maxAgeInput', 'delayInput'], (input) => {
    if (!Object.keys(input).length) {
        chrome.storage.local.set({'minAgeInput': 16})
        chrome.storage.local.set({'maxAgeInput': 99})
        chrome.storage.local.set({'delayInput': 1})
    } else {
        minAgeInput.value = input.minAgeInput;
        maxAgeInput.value = input.maxAgeInput;
        delayInput.value = input.delayInput;
        delayInputNum.innerText = input.delayInput;
    }
})

// init

minAgeInput.oninput = () => { // counter logick
    if (minAgeInput.value.length < 2 || minAgeInput.value.length > 2) {minAgeInput.value = 15; return 0};
    if (minAgeInput.value > maxAgeInput.value) {minAgeInput.value = parseInt(minAgeInput.value, 10) - 1; return 0};
    chrome.storage.local.set({minAgeInput: minAgeInput.value})
}

maxAgeInput.oninput = () => { // counter logick
    if (maxAgeInput.value.length < 2 || maxAgeInput.value.length > 2) {maxAgeInput.value = 25; return 0};
    if (maxAgeInput.value < minAgeInput.value) {maxAgeInput.value = parseInt(maxAgeInput.value, 10) + 1; return 0};
    chrome.storage.local.set({maxAgeInput: maxAgeInput.value})
}

delayInput.oninput = () => { // delay logick
    delayInputNum.innerText = delayInput.value;
    chrome.storage.local.set({delayInput: delayInput.value})
}

// Message area

function letter(message) { // accepts buttons states object
    htmlStates.state = message;
    let promise = new Promise((resolve, reject) => {
        chrome.storage.local.get(['minAgeInput', 'maxAgeInput', 'delayInput'], (input) => {
            htmlStates.minAgeInput = input.minAgeInput;
            htmlStates.maxAgeInput = input.maxAgeInput;
            htmlStates.delayInput = input.delayInput * 1000;
            resolve()
        })
    })
    promise.then(() => {
        let params = {
            // active: true,
            url: '*://vk.com/*'
            // lastFocusedWindow: true
        };
        chrome.tabs.query(params, init);
        function init(tabs) {
            htmlStates.url = tabs[0].url;
            htmlStates.state == 'reset' || htmlStates.state == 'idModeDefault' || htmlStates.state == 'idModeLite' ? chrome.tabs.sendMessage(tabs[0].id, htmlStates, afterMessage) : chrome.tabs.sendMessage(tabs[0].id, htmlStates)
        }
        function afterMessage(message) {
            if (message.response == 'received') {
                console.log('delivered');
            } else if (message.response == 'rejected') {
                switch (htmlStates.state) {
                    case 'reset':
                        localStorage.setItem('missedReset', '1');
                        break;
                    case 'idModeDefault':
                        localStorage.setItem('missedIdModeDefault', '1');
                        localStorage.setItem('missedIdModeLite', '0');
                        break;
                    case 'idModeLite':
                        localStorage.setItem('missedIdModeLite', '1');
                        localStorage.setItem('missedIdModeDefault', '0');
                        break;
                }
                console.log('missed');
            }
        }
    })
}

if (localStorage.getItem('about') == '1') {} else { localStorage.setItem('about', '1'); }
if (localStorage.getItem('missedReset') == '1') {letter('reset'); localStorage.setItem('missedReset', '0')};
if (localStorage.getItem('missedIdModeDefault') == '1') {letter('idModeDefault'); localStorage.setItem('missedIdModeDefault', '0')};
if (localStorage.getItem('missedIdModeLite') == '1') {letter('idModeLite'); localStorage.setItem('missedIdModeLite', '0')};

// Canvas area

let ageStats = new Chart(myChart, {
    type: 'pie', // doughnut
    data:{
        labels: null, // age
        datasets: [{
            label: 'Ages',
            data: null, // frequency
            backgroundColor:[
                '#A3C4BC','#BFD7B5','#E7EFC5','#F2DDA4','#564138','#CCA7A2','#7871AA'
            ],
            hoverBorderColor: '#808080',
            hoverBorderWidth: 2
        }]
    },
    options:{
        responsive: false
    }
});

function chartUpdate() {
    chrome.storage.local.get(['ageObjectKeys', 'ageObjectVals'], (input) => {
        ageStats.data.labels = input.ageObjectKeys;
        ageStats.data.datasets.forEach((dataset) => {
            dataset.data = input.ageObjectVals;
            console.log(ageStats.data.labels, dataset)
        });
        ageStats.update();
        var counter = 0;
        try {input.ageObjectVals.forEach(element => {
            counter += element;
        });}
        catch {}
        counterNum.innerText = counter;
    })
}
chartUpdate();
chrome.storage.onChanged.addListener(function(changes) {
    console.log(changes);
    if ('ageObjectKeys' || 'ageObjectVals' in changes) {
        chartUpdate();
    }
})

//

toggleBox.onchange = () => {
    if (toggleBox.checked) {
        localStorage.setItem('state', '1');
        letter(true)
    } else {
        localStorage.setItem('state', '0');
        letter(false)
    }
}
idModeBox.onchange = () => {
    if (idModeBox.checked) {
        localStorage.setItem('idState', '1')
        letter('idModeLite');
    } else {
        localStorage.setItem('idState', '0')
        letter('idModeDefault');
    }
}
authorBtn.onclick = () => {
    letter('author')
}
aboutBtn.onclick = () => {
    localStorage.setItem('about', '0');
    localStorage.setItem('about', '1');
}
langBtn.onclick = () => {
    chrome.browserAction.setPopup({popup: "pages/popupRU/popup.html"});
    window.close();
}
resetBtn.onclick = () => {
    letter('reset')
    chrome.storage.local.set({ageObjectKeys: 0, ageObjectVals: 0});
    localStorage.removeItem('state');
    localStorage.removeItem('missedIdModeDefault');
    localStorage.removeItem('missedIdModeLite');
    counterNum.innerText = 0;
    minAgeInput.value = 16;
    maxAgeInput.value = 25;
    delayInput.value = 1;
    delayInputNum.innerText = 1;
    chrome.storage.local.set({'minAgeInput': 16})
    chrome.storage.local.set({'maxAgeInput': 25})
    chrome.storage.local.set({'delayInput': 1})
}
