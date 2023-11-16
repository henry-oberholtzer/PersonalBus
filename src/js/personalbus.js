import { printError, printResponse } from "..";
export { busRequest, getBus };

function getBus(locID) {
    busRequest.personalBus(locID).then((response) => {
        if (response.resultSet) {
            printResponse(response);
        } else {
            printError(response);
        }
    });
}

class busRequest {
    static personalBus(locID) {
        return fetch(
            `https://developer.trimet.org/ws/v2/arrivals?locIDs=${locID}&appID=${process.env.APP_ID}`
        )
            .then((response) => {
                if (!response.ok) {
                    const errorResponse = `${response}`;
                    throw new Error(errorResponse);
                } else {
                    return response.json();
                }
            })
            .catch((error) => {
                return error;
            });
    }
}
