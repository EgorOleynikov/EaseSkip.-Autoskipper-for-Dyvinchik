chrome.runtime.onMessage.addListener(gotMessage);
let counter = 0;

function gotMessage(message, sender, sendResponse) {

console.log(counter += 1)

console.log(message);

var allQuestionnaires = document.getElementsByClassName('im-mess--text'); // array of all bot's messages
var currentQuestionnairesText = allQuestionnaires[allQuestionnaires.length - 1].innerHTML; // HTML of the last message
var splitedHTML = currentQuestionnairesText.split('<br>'); // array of strings from last message

var age = new Object(); // stores frequency of appearing certain age

console.log(splitedHTML)
console.log(dataRow) // logs section

const ifExpired = () => { // checks if expired
    if (splitedHTML[0] == "Время просмотра анкеты истекло, действие не выполнено.") return 4; else return 2;
}
var dataRow = splitedHTML[ifExpired()].split(', ');

age[dataRow[1]] =+ 1;

}
