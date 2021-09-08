chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    if (message.url.includes('vk.com/im' && '91050183')) {
        var allQuestionnaires = document.getElementsByClassName('im-mess--text'); // array of all bot's messages
        var currentQuestionnairesText = allQuestionnaires[allQuestionnaires.length - 1].innerText; // text of the last message
        var age = currentQuestionnairesText.match(/,([^,]+),/)[1];
        var ageObj = new Object(); // stores frequency of appearing certain age
        console.log(currentQuestionnairesText)
        console.log(age)
    } else {console.log('[error:01] Page does not match')}
}
