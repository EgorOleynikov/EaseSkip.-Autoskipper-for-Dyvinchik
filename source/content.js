chrome.runtime.onMessage.addListener(gotMessage);
var ageObj = new Object(); // stores frequency of appearing certain age
var idArr = []; // stores ids

function gotMessage(message, sender, sendResponse) {
    if (message.state === true && message.url.includes('vk.com/im') && document.getElementsByClassName("_im_page_peer_name")[0].innerText === 'Леонардо Дайвинчик') {
        var allQuestionnaires = document.getElementsByClassName('im-mess--text'); // array of all bot's messages
        var currentQuestionnairesText = allQuestionnaires[allQuestionnaires.length - 1].innerText; // text of the last message
        var linesArr = currentQuestionnairesText.split(', '); // lines of text were separated by a comma
        var currentID;

        for (i = 0; i < linesArr.length; i++) { // makes id
            currentID += linesArr[i][1];
        }
        console.log(currentID)

        if (idArr.includes(currentID) === false) { // main thread
            for (i = 0; i < linesArr.length; i++) {   // age pusher
                if (isNaN(linesArr[i]) === false) {
                    if (ageObj[linesArr[i]]) {
                        ageObj[linesArr[i]] += 1;
                    } else {ageObj[linesArr[i]] = 1;}
                }
                linesArr[i] = linesArr[i].replace(/\n/g, ' ');
            }
            idArr.push(currentID);
        } else {
            // Things that ext does when qestrs repeats
            console.log('[error:02] Questionnaires repeat')
        }
        
        console.log(currentQuestionnairesText)
        console.log(ageObj)
        console.log(linesArr)

    } else {console.log('[error:01] Page does not match')}
}
