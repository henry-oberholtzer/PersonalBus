import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import TrimetAPI from "./js/trimet_api";

const congestionCheck = (boolean) => {
    return boolean ? "Stuck in traffic" : false;
};

const toTime = (epoch) => {
    const time = new Date(epoch).toLocaleTimeString("en-US");
    return time;
};

function arrivals(locID, timeframe) {
    TrimetAPI.arrivals(locID, timeframe).then((response) => {
        if (response.resultSet) {
            printResponse(response);
        } else {
            printError(response);
        }
    });
}

function detourQuery(e) {
    const detours = e.target.id;
    return detours;
}

const arrivalCard = (busID, subType, stopID, estimatedTime, scheduledTime, inTraffic) => {
    const card = document.createElement("div");
    card.setAttribute("class", "card mt-2");
    card.setAttribute("style", "width: 20rem");
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    const p = document.createElement("p");
    p.setAttribute("class", "card-text");
    if (busID !== null) {
        p.append(`${subType} ${busID} for stop ${stopID}`);
    } else {
        p.append(`${subType} scheduled for stop ${stopID}`);
    }
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
    if (inTraffic !== false) {
        const trafficLi = document.createElement("li");
        trafficLi.setAttribute("class", "list-group-item");
        trafficLi.append(inTraffic);
        ul.append(trafficLi);
    }
    cardBody.append(p);
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
        const subType = arrival.routeSubType;
        const detoured = arrival.detoured;
        const detourArray = arrival.detour;
        const estimatedTime = toTime(arrival.estimated);
        const scheduledTime = toTime(arrival.scheduled);
        const inTraffic = congestionCheck(arrival.inCongestion);
        const routeColor = arrival.routeColor;
        const htmlCard = arrivalCard(busID, subType, stopID, estimatedTime, scheduledTime, inTraffic, routeColor);
        if (!document.getElementById(route)) {
            const buslineColumns = document.createElement("div");
            buslineColumns.setAttribute("style", `width: 22rem; border: 2px solid #${routeColor};`);
            buslineColumns.setAttribute("class", "d-flex flex-column align-items-center col m-2 p-1 rounded");
            buslineColumns.setAttribute("id", route);
            const titleCard = document.createElement("div");
            titleCard.setAttribute("class", "card mt-2");
            const titleCardBody = document.createElement("div");
            titleCardBody.setAttribute("class", "card-body");
            titleCardBody.setAttribute("style", "width: 20rem");
            const busHeader = document.createElement("h5");
            busHeader.setAttribute("style",`color:#${routeColor}`);
            busHeader.setAttribute("class", "card-title");
            busHeader.append(name);
            titleCardBody.append(busHeader);
            titleCard.append(titleCardBody);
            if (detoured) {
                const link = document.createElement("a");
                link.setAttribute("id",`${detourArray.toString()}`);
                link.addEventListener("click", detourQuery);
                const detourNotice = document.createElement("p");
                detourNotice.setAttribute("class", "card-text");
                detourNotice.setAttribute("id", "detourNotice");
                detourNotice.append(`Some stops may differ`);
                link.append(detourNotice);
                titleCardBody.append(link);
            }
            buslineColumns.append(titleCard);
            responseField.append(buslineColumns);
        }
        document.getElementById(route).append(htmlCard);
    });
}

function printError(response) {
    response;
}

function formResponse(e) {
    e.preventDefault();
    const rawLocationIDInput = document.getElementById("stopIDs").value;
    const timeframe = parseInt(document.getElementById("timeframe").value);
    const regex = /\d*/gi;
    const processedLocationIDInput = rawLocationIDInput.match(regex);
    const locIDstring = processedLocationIDInput.toString();
    arrivals(locIDstring, timeframe);
}

document.querySelector("form").addEventListener("submit", formResponse);
