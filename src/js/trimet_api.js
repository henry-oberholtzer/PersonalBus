export default class TrimetAPI {
    static arrivals(locID, timeframe) {
        return fetch(
            `http://developer.trimet.org/ws/v2/arrivals?locIDs=${locID}&minutes=${timeframe}&appID=${process.env.APP_ID}`,
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
