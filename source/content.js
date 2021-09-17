/*
BUGS:
[solved] For some reason skips all quers despite age. Heeds stop button to be added. :age was in string format
Not always closes big pictures

TO DO LIST:
Identification of the questionnaire by the length of the base64 string and 5 characters from it.
Processing questionnaires without photos, processing bot messages.
Add input age handler.
Add delay choose.

ADDED:
Promise waiting added, bug fixing, so far functionality is quite on the level I wanted it at the beginning but I've got some fancy things to be added.
*/

chrome.runtime.onMessage.addListener(messageCheck);

function messageCheck(message) { //message sorter
    if (message.state === true) {
        gotMessage(message)
    }
    if (message.state === false) {
        observer.disconnect
    }
}

var ageObj = new Object(); // stores frequency of appearing certain age
var imgBase64Arr = [];
var messageBox; // observer's taget
var props = {
    childList: true
};

// window.onerror = function(message, source, lineno, colno, error) {
//     for (argument of arguments) {
//         console.log(argument)
//     }
// }

var observer = new MutationObserver(function(mutations) {
    console.log(mutations)
    for (let mutation of mutations) {
        if ((mutation.addedNodes.length > 0) && (!mutation.nextSibling) && (mutation.addedNodes[0].innerText.includes("Нашел кое-кого для тебя, смотри:")) && (/(^(?:\S+\s+\n?){1,2})/.exec(mutation.addedNodes[0].innerText)[0] == 'Леонардо Дайвинчик ')) {
            console.log('some suspesious text')
            setTimeout(function() {
                gotMessage("observerCallback")
            }, 1000)
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
                var currentImgBase64;
                function toDataURL(src) {
                    var img = new Image();
                    img.crossOrigin = 'Anonymous';
                    var dataURL;
                    img.onload = function() {
                        var canvas = document.createElement('CANVAS');
                        var ctx = canvas.getContext('2d');
                        canvas.height = this.naturalHeight;
                        canvas.width = this.naturalWidth;
                        ctx.drawImage(this, 0, 0);
                        dataURL = canvas.toDataURL('image/jpeg', .8);
                        currentImgBase64 = dataURL;
                        resolve(currentImgBase64);
                    };
                    img.src = src;
                }
                toDataURL(imagePicSrc)
                console.log(imagePicSrc)
            });
    
            promise.then(
                result => {
                    if (imgBase64Arr.includes(result) === false) { // if no such id are in the arr
                        for (i = 0; i < linesArr.length; i++) { // age pusher
                            if (isNaN(linesArr[i]) === false) {
                                currentAge = parseInt(linesArr[i], 10);
                                if (ageObj[linesArr[i]]) {
                                    ageObj[linesArr[i]] += 1;
                                } else {ageObj[linesArr[i]] = 1;}
                            }
                            linesArr[i] = linesArr[i].replace(/\n/g, ' ');
                        }
                        if (currentAge < 16) { // skip btn press
                            console.log(currentAge)
                            console.log("kinda low bruh")
                            skipBtn.click();
                        }
                        imgBase64Arr.push(result);
                    } else {
                        // Things that ext does when qestrs repeats
                        //skipBtn.click()
                        console.log('[error:02] Questionnaire repeat')
                    }
                }
            );
            
            console.log(currentQuestionnairesText)
            console.log(ageObj)
            console.log(linesArr)
            console.log(imgBase64Arr)

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
        observer.observe(messageBox, props)

    } else {console.log('[error:01] Page does not match')}
}
