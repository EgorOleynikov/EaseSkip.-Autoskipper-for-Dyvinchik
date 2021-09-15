chrome.runtime.onMessage.addListener(gotMessage);
var ageObj = new Object(); // stores frequency of appearing certain age
var imgBase64Arr = [];
var messageBox = document.getElementsByClassName("_im_peer_history im-page-chat-contain")[0]; // observer's taget
var props = {
    childList: true
};
var observer = new MutationObserver(function(mutations) {
    console.log(mutations)
    for (let mutation of mutations) {
        if ((mutation.addedNodes.length > 0) && (!mutation.nextSibling) && (mutation.addedNodes[0].innerText.includes("Нашел кое-кого для тебя, смотри:"))) {
            var regex = /(^(?:\S+\s+\n?){1,2})/
            if (regex.exec(mutation.addedNodes[0].innerText)[0] == 'Леонардо Дайвинчик ') {
                console.log('some suspesious text')
                setTimeout(function() {
                    gotMessage("observerCallback")
                }, 5000)
            }
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
                    console.log(dataURL)
                };
                img.src = src;
                }
            toDataURL(imagePicSrc)
            console.log(imagePicSrc)
    
            if (imgBase64Arr.includes(currentImgBase64) === false) { // main thread
                for (i = 0; i < linesArr.length; i++) {   // age pusher
                    if (isNaN(linesArr[i]) === false) {
                        if (ageObj[linesArr[i]]) {
                            ageObj[linesArr[i]] += 1;
                        } else {ageObj[linesArr[i]] = 1;}
                        currentAge = linesArr[i];
                    }
                    linesArr[i] = linesArr[i].replace(/\n/g, ' ');
                }
                if (currentAge < 16) { // skip btn press
                    console.log(currentAge)
                    skipBtn.click();
                }
                imgBase64Arr.push(currentImgBase64);
            } else {
                // Things that ext does when qestrs repeats
                skipBtn.click()
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
                    console.log(closeBtn)
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
