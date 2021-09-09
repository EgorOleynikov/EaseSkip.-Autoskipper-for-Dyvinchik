chrome.runtime.onMessage.addListener(gotMessage);
var ageObj = new Object(); // stores frequency of appearing certain age

function gotMessage(message, sender, sendResponse) {
    if (message.url.includes('vk.com/im' && '91050183')) {
        var allQuestionnaires = document.getElementsByClassName('im-mess--text'); // array of all bot's messages
        var currentQuestionnairesText = allQuestionnaires[allQuestionnaires.length - 1].innerText; // text of the last message
        var currentQuestionnairesTextArray = currentQuestionnairesText.split(', ');
        for (i = 0; i < currentQuestionnairesTextArray.length; i++) {
            if (isNaN(currentQuestionnairesTextArray[i]) === false) {
                if (ageObj[currentQuestionnairesTextArray[i]]) {
                    ageObj[currentQuestionnairesTextArray[i]] += 1;
                } else {ageObj[currentQuestionnairesTextArray[i]] = 1;}
            }
        };
        // var age = currentQuestionnairesText.match(/,([^,]+),/)[1];
        
        console.log(currentQuestionnairesText)
        console.log(ageObj)
        console.log(currentQuestionnairesTextArray)
    } else {console.log('[error:01] Page does not match')}
}
