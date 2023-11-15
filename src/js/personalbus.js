import { printError, printResponse } from "..";

export default class busRequest {
    static personalBus(locID) {
        let promise = new Promise((resolve, reject) => {
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
        promise.then(
            (response) => {
                printResponse(response);
            },
            (errorResponse) => {
                printError(errorResponse);
            }
        );
    }
}
