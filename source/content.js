chrome.runtime.onMessage.addListener(gotMessage);
var ageObj = new Object(); // stores frequency of appearing certain age

function gotMessage(message, sender, sendResponse) {
    if (message.state === true && message.url.includes('vk.com/im') && document.getElementsByClassName("_im_page_peer_name")[0].innerText === 'Леонардо Дайвинчик') {
        var allQuestionnaires = document.getElementsByClassName('im-mess--text'); // array of all bot's messages
        var currentQuestionnaire = allQuestionnaires[allQuestionnaires.length - 1]; // last message
        var currentQuestionnairesText = currentQuestionnaire.innerText; // text of the last message
        var linesArr = currentQuestionnairesText.split(', '); // lines of text separated by a comma
        var imagePic = currentQuestionnaire.getElementsByClassName("page_post_sized_thumbs clear_fix")[0].innerHTML;
        var url = imagePic.substring(imagePic.indexOf("url(") + 1, imagePic.indexOf(');"'));
        console.log(url)

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
                console.log(dataURL)
            };
            img.src = src;
            }
            toDataURL(
            '')


        if (1) { // main thread
            for (i = 0; i < linesArr.length; i++) {   // age pusher
                if (isNaN(linesArr[i]) === false) {
                    if (ageObj[linesArr[i]]) {
                        ageObj[linesArr[i]] += 1;
                    } else {ageObj[linesArr[i]] = 1;}
                }
                linesArr[i] = linesArr[i].replace(/\n/g, ' ');
            }
        } else {
            // Things that ext does when qestrs repeats
            console.log('[error:02] Questionnaires repeat')
        }
        
        console.log(currentQuestionnairesText)
        console.log(ageObj)
        console.log(linesArr)

    } else {console.log('[error:01] Page does not match')}
}
