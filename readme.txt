Расширение для chrome браузеров позволяющее удобнее взаимодействовать с VK ботом Дайвинчик. Автоматический пропуск анкет неподходящего возраста и статистика.

An extension for chrome browsers that allows you to more conveniently interact with the Dyvinchik VK bot. Automatic skipping of questionnaires of unsuitable age and statistics.

/*

BUGS:
[solved] For some reason skips all quers despite age. Heeds stop button to be added. :age was in string format
[solved] Popup refreshes input data when closed. Adding localStorage to it might solve the problem. :saving vals before popup closing
[solved] Stop button could do better. :now it does. Stop-word added.
[~solved] Not always closes big pictures. :idk why it still leaves them open, the code gets close button and presses it. The error fires when delay set too low.
[solved] Can't work without profile picture. :now the code has workarounds for such cases.
[solved] input values are null sometimes at js.230. :resolve was called before the thing was done.

TO DO LIST:

ADDED:
Promise waiting added, bug fixing, so far functionality is quite on the level I wanted it at the beginning but I've got some fancy things to be added.
Identification of the questionnaire by the length of the base64 string and 5 characters from it.
Added input age handler.
Added delay choose.
Two-way messages added.
The forwarding of messages between the parties was giving way to the use of chrome storage api. Because the structure is already based on sending messages, the decision to combine chrome api with a ready-made structure was made.
Processing questionnaires without photos
Pretty design added.
Fancy-looking statistic added.
Verification without full-screen photo by url added.
Added a counter of missed messages with a response to the popup, so that if the reconnect is successful, undelivered messages will be sent again.
Max age input handler.
Language swap.
About pages.

*/
