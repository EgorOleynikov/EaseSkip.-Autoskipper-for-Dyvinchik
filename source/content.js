/*

BUGS:
[solved] For some reason skips all quers despite age. Heeds stop button to be added. :age was in string format
[solved] Popup refreshes input data when closed. Adding localStorage to it might solve the problem. :saving vals before popup closing
Stop button could do better.
Not always closes big pictures.
Can't work without profile picture.

TO DO LIST:
Processing questionnaires without photos, processing bot messages.
Add design.
Add statistic.
Try to make verification without full-screen photo by url in a new branch. Doub

ADDED:
Promise waiting added, bug fixing, so far functionality is quite on the level I wanted it at the beginning but I've got some fancy things to be added.
Identification of the questionnaire by the length of the base64 string and 5 characters from it.
Added input age handler.
Added delay choose.
Two-way messages added.
The forwarding of messages between the parties was giving way to the use of chrome storage api. Because the structure is already based on sending messages, the decision to combine chrome api with a ready-made structure was made.

*/

chrome.runtime.onMessage.addListener(messageCheck);

var ageObj = localStorage.getItem('VKGrabberAgeObj') === null ? new Object() : JSON.parse(localStorage.getItem('VKGrabberAgeObj')); // stores frequency of appearing certain age
var messageBox; // observer's taget
var props = {
    childList: true
};
var htmlStates;
window.onbeforeunload = () => {
    localStorage.setItem('VKGrabberAgeObj', JSON.stringify(ageObj))
}

function messageCheck(message) { //message sorter
    if (message.state === true) {
        htmlStates = message;
        let ifNull = () => {
            return new Promise((resolve, reject) => {
                if ((htmlStates.ageInput || htmlStates.delayInput) == null) {
                    chrome.storage.local.get(['ageInput', 'delayInput'], (input) => {
                        htmlStates.ageInput = input.ageInput;
                        htmlStates.delayInput = input.delayInput * 1000;
                    })
                    resolve()
                }
            })
        }
        ifNull()
        console.log(message)
        chrome.storage.onChanged.addListener(function(changes) {
            console.log(changes)
            if ('ageInput' || 'delayInput' in changes) {
                chrome.storage.local.get(['ageInput', 'delayInput'], (input) => {
                    htmlStates.ageInput = input.ageInput;
                    htmlStates.delayInput = input.delayInput * 1000;
                })
            }
        })
        gotMessage(message)
    }
    if (message.state === false) {
        observer.disconnect();
        console.log("observer has been disconnected")
    }
    if (message.state == 'reset') {
        localStorage.removeItem('VKGrabberAgeObj')
        ageObj = {};
    }
}
// window.onerror = function(message, source, lineno, colno, error) {
//     for (argument of arguments) {
//         console.log(argument)
//     }
// }
var observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
        if ((mutation.addedNodes.length > 0) && (!mutation.nextSibling) && (mutation.addedNodes[0].innerText.includes("Нашел кое-кого для тебя, смотри:")) && (/(^(?:\S+\s+\n?){1,2})/.exec(mutation.addedNodes[0].innerText)[0] == 'Леонардо Дайвинчик ')) {
            console.log('verified')
            setTimeout(function() {
                observer.disconnect()
                gotMessage("observerCallback")
            }, htmlStates.delayInput);
        }
    }
});

function gotMessage(message, sender, sendResponse) {
    if (message === "observerCallback" || (message.state === true && message.url.includes('vk.com/im') && document.getElementsByClassName("_im_page_peer_name")[0].innerText === 'Леонардо Дайвинчик')) {
        var allQuestionnaires = document.getElementsByClassName('im-mess--text'); // array of all bot's messages
        var currentQuestionnaire = allQuestionnaires[allQuestionnaires.length - 1]; // last message
        var currentQuestionnairesText = currentQuestionnaire.innerText; // text of the last message
        var linesArr = currentQuestionnairesText.split(', '); // lines of text separated by comma
        var imagePic = currentQuestionnaire.getElementsByClassName("page_post_sized_thumbs clear_fix")[0].getElementsByTagName("a")[0] //.innerHTML;
        var skipBtn = document.getElementsByClassName("Button Button--negative Button--size-m Button--wide Button--overflow BotButton BotButton--text")[0];
        messageBox = document.getElementsByClassName("_im_peer_history im-page-chat-contain")[0];
        var currentAge;
        var closeBtn;
        var imagePicSrc;
        imagePic.click()

        function mainFunction(imagePicSrc) {

            var promise = new Promise(function(resolve, reject) {
                function toDataURL(src) {
                    var img = new Image();
                    img.crossOrigin = 'Anonymous';
                    var currentImgBase64;
                    img.onload = function() {
                        var canvas = document.createElement('CANVAS');
                        var ctx = canvas.getContext('2d');
                        canvas.height = this.naturalHeight;
                        canvas.width = this.naturalWidth;
                        ctx.drawImage(this, 0, 0);
                        currentImgBase64 = canvas.toDataURL('image/jpeg', .8);
                        let baseLength = currentImgBase64.length;
                        currentImgID = currentImgBase64.length + currentImgBase64[baseLength - 10] + currentImgBase64[baseLength - 20] + currentImgBase64[baseLength - 30];
                        resolve(currentImgID);
                    };
                    img.src = src;
                }
                toDataURL(imagePicSrc)
                console.log(imagePicSrc)
            });

            promise.then(
                result => {
                    let currentIdStr;
                    function checkBaseExists() {
                        if (localStorage.getItem("VKGrabberData") !== null) {
                            currentIdStr = localStorage.getItem("VKGrabberData");
                            if (currentIdStr.includes(result)) {
                                return true
                            } else return false
                        } else return false
                    }
                    if (checkBaseExists() === false) { // if no such id are in the arr
                        for (i = 0; i < linesArr.length; i++) { // age pusher
                            if (isNaN(linesArr[i]) === false) {
                                currentAge = parseInt(linesArr[i], 10);
                                if (ageObj[linesArr[i]]) {
                                    ageObj[linesArr[i]] += 1;
                                } else {ageObj[linesArr[i]] = 1;}
                            }
                            linesArr[i] = linesArr[i].replace(/\n/g, ' ');
                        }
                        if (currentAge < parseInt(htmlStates.ageInput, 10)) { // skip btn press
                            console.log(currentAge)
                            console.log("Lower than minimal age")
                            skipBtn.click();
                        }
                        if (currentIdStr) {
                            currentIdStr += "," + result;
                        } else {
                            currentIdStr += result;
                        }
                        console.log(result)
                        localStorage.setItem("VKGrabberData", currentIdStr)
                        chrome.storage.local.set({ageObjectKeys: Object.keys(ageObj), ageObjectVals: Object.values(ageObj)})
                    } else {
                        // Things that ext does when qestrs repeats
                        skipBtn.click()
                        console.log('[error:02] Questionnaire repeat')
                    }
                }
            );

            console.log(currentQuestionnairesText)
            console.log(ageObj)
            console.log(linesArr)
            console.log(htmlStates.delayInput, htmlStates.ageInput)

        }

        function callFunction(callback) {
            var checkExist = setInterval(function() {
                if ((document.getElementsByClassName("clear_fix pv_photo_wrap")[0] != undefined) && (document.getElementsByClassName("pv_close_btn")[0] != undefined) && (document.getElementById("pv_photo").getElementsByTagName("img")[0].complete)) {
                    imagePicSrc = document.getElementById("pv_photo").getElementsByTagName("img")[0].src;
                    closeBtn = document.getElementsByClassName("pv_close_btn")[0];
                    closeBtn.click()
                    clearInterval(checkExist)
                    callback(imagePicSrc)
                } else console.log("[debugger] Element wasn't loaded yet.")
            }, 150);
        }

        callFunction(mainFunction)
        observer.observe(messageBox, {childList: true});

    } else {
        console.log('[error:01] Page does not match')
        window.location.replace("https://vk.com/dayvinchik")
    }
}








// let observer = new MutationObserver(mutations => {
//     console.log(mutations); // console.log(изменения)
//   });

//   // наблюдать за всем, кроме атрибутов
//   let cock = document.querySelector("body");
//   observer.observe(cock, {
//     childList: true, // наблюдать за непосредственными детьми
//     // subtree: true, // и более глубокими потомками
//     // characterDataOldValue: true // передавать старое значение в колбэк
//   });
