import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import { busRequest } from "./js/personalbus";
export { printResponse, printError };

const congestionCheck = (boolean) => {
    return boolean ? "Stuck in traffic" : "Not stuck in traffic";
};

const toTime = (epoch) => {
    return new Date(epoch).toLocaleTimeString("en-US");
};

const arrivalCard = (route, busID, stopID, name, estimatedTime, scheduledTime, inTraffic) => {
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("style", "width: 20rem");
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    const cardHeader = document.createElement("h5");
    cardHeader.setAttribute("class", "card-title");
    cardHeader.append(`Route ${route} - ${name}`);
    const p = document.createElement("p");
    p.setAttribute("class", "card-text");
    p.append(`Bus ${busID} for ${stopID}`);
    const ul = document.createElement("ul");
    ul.setAttribute("class", "list-group list-group-flush");
    const estimatedLi = document.createElement("li");
    estimatedLi.append(`Estimated arrival ${estimatedTime}`);
    const scheduledLi = document.createElement("li");
    scheduledLi.append(`Scheduled arrival at ${scheduledTime}`);
    const trafficLi = document.createElement("li");
    trafficLi.append(inTraffic);
    ul.append(estimatedLi, scheduledLi, trafficLi);
    cardBody.append(cardHeader, p);
    card.append(cardBody, ul);
    return card;
};

function printResponse(response) {
    const resultSet = response.resultSet;
    const responseField = document.getElementById("response");
    responseField.innerHTML = "";
    resultSet.arrival.forEach((arrival) => {
        const route = arrival.route;
        const busID = arrival.vehicleID;
        const stopID = arrival.locID;
        const name = arrival.shortSign;
        const estimatedTime = toTime(arrival.estimated);
        const scheduledTime = toTime(arrival.scheduled);
        const inTraffic = congestionCheck(arrival.inCongestion);
        const htmlCard = arrivalCard(route, busID, stopID, name, estimatedTime, scheduledTime, inTraffic);
        responseField.append(htmlCard);
    });
}

function printError() {}

function formResponse(e) {
    e.preventDefault();
    const locID = parseInt(document.getElementById("stopID").value, 10);
    busRequest.personalBus(locID);
}

document.querySelector("form").addEventListener("submit", formResponse);
