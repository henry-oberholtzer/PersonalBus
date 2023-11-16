import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import { getBus } from "./js/personalbus";
export { printResponse, printError };

const congestionCheck = (boolean) => {
    return boolean ? "Stuck in traffic" : "Not stuck in traffic";
};

const toTime = (epoch) => {
    const time = new Date(epoch).toLocaleTimeString("en-US");
    return time;
};

const arrivalCard = (route, busID, stopID, name, estimatedTime, scheduledTime, inTraffic, routeColor) => {
    const card = document.createElement("div");
    card.setAttribute("class", "card mt-2");
    card.setAttribute("style", "width: 20rem");
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    const cardHeader = document.createElement("h5");
    cardHeader.setAttribute("class", "card-title");
    cardHeader.setAttribute("style",`color:#${routeColor}`);
    cardHeader.append(`Route ${route} - ${name}`);
    const p = document.createElement("p");
    p.setAttribute("class", "card-text");
    p.append(`Bus ${busID} for ${stopID}`);
    const ul = document.createElement("ul");
    ul.setAttribute("class", "list-group list-group-flush");
    const estimatedLi = document.createElement("li");
    estimatedLi.setAttribute("class", "list-group-item");
    estimatedLi.append(`Estimated arrival ${estimatedTime}`);
    const scheduledLi = document.createElement("li");
    scheduledLi.setAttribute("class", "list-group-item");
    scheduledLi.append(`Scheduled arrival at ${scheduledTime}`);
    ul.append(scheduledLi);
    if (estimatedTime !== "Invalid Date") {
        const estimatedLi = document.createElement("li");
        estimatedLi.setAttribute("class", "list-group-item");
        estimatedLi.append(`Estimated arrival ${estimatedTime}`);
        ul.append(estimatedLi);
    }
    const trafficLi = document.createElement("li");
    trafficLi.setAttribute("class", "list-group-item");
    trafficLi.append(inTraffic);
    ul.append(trafficLi);
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
        const stopID = arrival.locid;
        const name = arrival.shortSign;
        const estimatedTime = toTime(arrival.estimated);
        const scheduledTime = toTime(arrival.scheduled);
        const inTraffic = congestionCheck(arrival.inCongestion);
        const routeColor = arrival.routeColor;
        const htmlCard = arrivalCard(route, busID, stopID, name, estimatedTime, scheduledTime, inTraffic, routeColor);
        responseField.append(htmlCard);
    });
}

function printError(response) {
    response;
}

function formResponse(e) {
    e.preventDefault();
    const locID = parseInt(document.getElementById("stopID").value);
    getBus(locID);
}

document.querySelector("form").addEventListener("submit", formResponse);
