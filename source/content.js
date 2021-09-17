/*
BUGS:
For some reason skips all quers despite age. Heeds stop button to be added.

TO DO LIST:
Identification of the questionnaire by the length of the base64 string and 5 characters from it.
Processing questionnaires without photos, processing bot messages.

*/

chrome.runtime.onMessage.addListener(gotMessage);

var ageObj = new Object(); // stores frequency of appearing certain age
var imgBase64Arr = [];
var messageBox; // observer's taget
var props = {
    childList: true
};

window.onerror = function(message, source, lineno, colno, error) {
    for (argument of arguments) {
        console.log(argument)
    }
}

var observer = new MutationObserver(function(mutations) {
    console.log(mutations)
    for (let mutation of mutations) {
        if ((mutation.addedNodes.length > 0) && (!mutation.nextSibling) && (mutation.addedNodes[0].innerText.includes("Нашел кое-кого для тебя, смотри:")) && (/(^(?:\S+\s+\n?){1,2})/.exec(mutation.addedNodes[0].innerText)[0] == 'Леонардо Дайвинчик ')) {
            console.log('some suspesious text')
            setTimeout(function() {
                gotMessage("observerCallback")
            }, 10000)
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
        var currentImgBase64;
        var currentAge;
        var closeBtn;
        var imagePicSrc;

        imagePic.click()

        function mainFunction(imagePicSrc) {

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
                    currentImgBase64 =  dataURL;
                    console.log(currentImgBase64)
                    console.log(typeof(currentImgBase64))
                    console.log(currentImgBase64[0])
                };
                img.src = src;
                }
            toDataURL(imagePicSrc)
            console.log(imagePicSrc)
    
            if ((imgBase64Arr.includes(currentImgBase64)) === false) { // if no such id are in the arr
                for (i = 0; i < linesArr.length; i++) { // age pusher
                    if (isNaN(linesArr[i]) === false) {
                        if (ageObj[linesArr[i]]) {
                            ageObj[linesArr[i]] += 1;
                        } else {ageObj[linesArr[i]] = 1;}
                        currentAge = parseInt(linesArr[i], 10);
                    }
                    linesArr[i] = linesArr[i].replace(/\n/g, ' ');
                }
                if (currentAge < 16) { // skip btn press
                    console.log(typeof(currentAge))
                    console.log(typeof(16))
                    console.log(currentAge)
                    skipBtn.click();
                }
                imgBase64Arr.push(currentImgBase64);
            } else {
                // Things that ext does when qestrs repeats
                //skipBtn.click()
                console.log('[error:02] Questionnaire repeat')
            }
            
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
