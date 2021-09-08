function setup() {

    const startButton = document.getElementById("pupup-start-button");
    const stopButton = document.getElementById("popup-stop-button");

    const letter = (x) =>{
        let params = {
            active: true,
            currentWindow: true
        }
        chrome.tabs.query(params, init); 
        function init(tabs){
        let message = x;
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