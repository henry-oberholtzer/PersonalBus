import { printError, printResponse } from "..";
export { busRequest, getBus };

function getBus(locID) {
    const promise = busRequest.personalBus(locID);
    promise.then(
        (response) => {
            printResponse(response);
        },
        (errorResponse) => {
            printError(errorResponse);
        });
}

class busRequest {
    static personalBus(locID) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            const url = `https://developer.trimet.org/ws/v2/arrivals?locIDs=${locID}&appID=${process.env.APP_ID}&json=true`;
            request.addEventListener("loadend", () => {
                const response = JSON.parse(this.responseText);
                if (Object.prototype.hasOwnProperty.call(response.resultSet, "error")) {
                    reject([this, response, locID]);
                } else {
                    resolve([response, locID]);
                }
            });
            request.open("GET", url, true);
            request.send();
        });
    }
}
