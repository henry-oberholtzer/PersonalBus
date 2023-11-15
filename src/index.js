import personalBus from "./js/personalbus";
export {printResponse, printError};

function printResponse() {

}

function printError() {

}

function formResponse(e) {
    e.preventDefault();
    const locID = 7205;
    personalBus(locID);
}

document.querySelector("form").addEventListener("submit", formResponse);