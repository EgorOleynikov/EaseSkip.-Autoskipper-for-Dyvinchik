function setup() {

    const startButton = document.getElementById("pupup-start-button");
    const stopButton = document.getElementById("popup-stop-button");

    const letter = (x) =>{
        let params = {
            active: true,
            lastFocusedWindow: true
        }
        chrome.tabs.query(params, init); 
        function init(tabs){
            let message = {
                state: x,
                url: tabs[0].url
            }
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    }

    const turnOn = () => {

        letter(true);

    }

    const turnOff = () => {

        letter(false);

    }    

    startButton.addEventListener("click", turnOn);
    stopButton.addEventListener("click", turnOff);

}
setup()