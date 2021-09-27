// init

const startButton = document.getElementById("pupup-start-button");
const stopButton = document.getElementById("popup-stop-button");
const ageInput = document.getElementById("ageInput");
const delayInput = document.getElementById("delayInput");
const delayInputNum = document.querySelector("#delayInputNum");
const myChart = document.getElementById("myChart").getContext('2d');
const counterNum = document.getElementById("counterNum");
const resetBtn = document.getElementById("resetBtn");

var htmlStates = {
    state: null,
    ageInput: null,
    delayInput: null,
    url: null
};

chrome.storage.local.get(['ageInput', 'delayInput'], (input) => {
    if (!Object.keys(input).length) {
        chrome.storage.local.set({'ageInput': 16})
        chrome.storage.local.set({'delayInput': 1})
    } else {
        ageInput.value = input.ageInput;
        delayInput.value = input.delayInput;
        delayInputNum.innerText = input.delayInput;
    }
})

// init

ageInput.oninput = () => { // counter logick
    if (ageInput.value.length < 2) {ageInput.value = 15};
    chrome.storage.local.set({ageInput: ageInput.value})
}

delayInput.oninput = () => { // delay logick
    delayInputNum.innerText = delayInput.value;
    chrome.storage.local.set({delayInput: delayInput.value})
}

// Message area

function letter(message) { // accepts buttons states object
    htmlStates.state = message;
    let promise = new Promise((resolve, reject) => {
        chrome.storage.local.get(['ageInput', 'delayInput'], (input) => {
            htmlStates.ageInput = input.ageInput;
            htmlStates.delayInput = input.delayInput * 1000;
        })
        resolve()
    })
    promise.then(() => {
        let params = {
            active: true,
            // lastFocusedWindow: true
        };
        chrome.tabs.query(params, init);
        function init(tabs) {
            htmlStates.url = tabs[0].url;
            chrome.tabs.sendMessage(tabs[0].id, htmlStates);
        }
    })
}

// Canvas area

let ageStats = new Chart(myChart, {
    type: 'doughnut',
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
    options:{}
});

function chartUpdate() {
    chrome.storage.local.get(['ageObjectKeys', 'ageObjectVals'], (input) => {
        ageStats.data.labels = input.ageObjectKeys;
        ageStats.data.datasets.forEach((dataset) => {
            dataset.data = input.ageObjectVals;
            console.log(ageStats.data.labels, dataset)
        });
        ageStats.update();
    })
}
chartUpdate();
chrome.storage.onChanged.addListener(function(changes) {
    if ('ageObjectKeys' || 'ageObjectVals' in changes) {
        chartUpdate();
    }
})

//

startButton.onclick = () => {
    letter(true)
};
stopButton.onclick = () => {
    letter(false)
};
resetBtn.onclick = () => {
    letter('reset')
    chrome.storage.local.set({ageObjectKeys: 0, ageObjectVals: 0});
    counterNum.innerText = 0;
}
