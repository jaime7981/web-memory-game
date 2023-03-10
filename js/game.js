
var scoreboardCompParam = "Time";
var testSvg = "M228 319.5H12C5.64873 319.5 0.5 314.351 0.5 308V12C0.5 5.64873 5.64873 0.5 12 0.5H159.175C159.571 0.5 159.952 0.656748 160.233 0.936021L239.057 79.2681C239.341 79.5497 239.5 79.9326 239.5 80.3321V308C239.5 314.351 234.351 319.5 228 319.5Z"
var svgHeart = "M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z";

var fakedData = {
    "scoreboard":[
        {"username":"jaime",
         "time":60,
         "turns":20,
         "cards":8,
         "date":"21/6/2022"},
        {"username":"juan",
         "time":21,
         "turns":10,
         "cards":8,
         "date":"21/6/2022"},
        {"username":"manuel",
         "time":23,
         "turns":13,
         "cards":18,
         "date":"21/6/2022"},
        {"username":"pablo",
         "time":60,
         "turns":20,
         "cards":32,
         "date":"21/6/2022"},
        {"username":"diego",
         "time":23,
         "turns":13,
         "cards":36,
         "date":"21/6/2022"}
    ]
};

function loadCards() {
    let mainGameClass = document.getElementsByClassName('main-game-section')[0];
    let numberOfCards = document.getElementById('ddl-size');
    let cardNumbers = numberOfCards.value;

    let loadFirstCardsCounter = 0;

    mainGameClass.innerHTML = null;
    for (let i = 0; i < cardNumbers; i++) {
        let newCard = document.createElement("div");
        newCard.className = "card";
        // newCard.innerHTML = (i + 1).toString();
        // newCard.appendChild(insertSvgIntoCard());

        if (loadFirstCardsCounter < 4 & loadFirstCardsCounter > 1) {
            newCard.appendChild(insertSvgIntoCard());
        }
        loadFirstCardsCounter += 1;

        mainGameClass.appendChild(newCard);
    }
}

function insertSvgIntoCard() {
    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let svgPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
    svgElement.setAttribute("viewBox", "0 0 100 100");
    svgElement.appendChild(createRandomPath(svgPath));
    return svgElement;
}

function createRandomPath(svgPathElement) {
    svgPathElement.style.stroke = "black";
    svgPathElement.style.strokeWidth = "1px";
    //svgPathElement.setAttribute("d", svgHeart);
    svgPathElement.setAttribute("d", generateRandomSvg());
    return svgPathElement;
}

function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * (min + max));
}

function generateRandomSvg() {
    let cardHeight = 55;
    let cardWidth = 80;
    // let svgString = "M " + getRandomInt(cardHeight) + "," + getRandomInt(cardWidth) + " ";
    let svgString = "M " + getRandomInt(-cardWidth/2, cardWidth/2) + "," + getRandomInt(-cardHeight/2, cardHeight/2) + " ";
    let numberOfVectors = getRandomInt(15, 40);

    for (let i = 0; i < numberOfVectors; i++) {
        svgString += "L" + getRandomInt(30, 150) + " " + getRandomInt(30, 150) + " ";
    }

    svgString += "z";
    return svgString;
}

function loadScoreboard(comparitionParam) {
    let scoreboardData = fakedData["scoreboard"];
    let cardsNr = document.getElementById('ddl-size-scoreboard');
    let paramColTitle = document.getElementById("scoreboard-data-comparition-type");
    let placeCounter = 1;
    paramColTitle.innerHTML = comparitionParam;

    removeElementsByClass("scoreboard-table-data");

    if (scoreboard == null) {
        return false;
    }
    for (gameData in scoreboardData) {
        let data = scoreboardData[gameData];
        if (cardsNr.value == data["cards"]) {
            let paramData = null;
            
            if (comparitionParam == "Time") {
                paramData = data["time"];
            }
            else if (comparitionParam == "Turns") {
                paramData = data["turns"];
            }
            insertDataToScoreboard(placeCounter,
                                   data["username"],
                                   paramData,
                                   data["date"]);
            placeCounter += 1;

        }
    }
    return true;
}

function insertDataToScoreboard(place, username, type, date) {
    let placeElement = document.getElementById("scoreboard-data-place");
    let usernameElement = document.getElementById("scoreboard-data-username");
    let paramElement = document.getElementById("scoreboard-data-param");
    let dateElement = document.getElementById("scoreboard-data-date");

    let placeChild = document.createElement("p");
    placeChild.className = "scoreboard-table-data";
    placeChild.innerHTML = place;
    placeElement.appendChild(placeChild);

    let usernameChild = document.createElement("p");
    usernameChild.className = "scoreboard-table-data";
    usernameChild.innerHTML = username;
    usernameElement.appendChild(usernameChild);

    let paramChild = document.createElement("p");
    paramChild.className = "scoreboard-table-data";
    paramChild.innerHTML = type;
    paramElement.appendChild(paramChild);

    let dateChild = document.createElement("p");
    dateChild.className = "scoreboard-table-data";
    dateChild.innerHTML = date;
    dateElement.appendChild(dateChild);
}

function removeElementsByClass(className){
    let elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

window.onload = function pageonLoad() {
    loadCards();
    loadScoreboard(scoreboardCompParam);
    let numberOfCards = document.getElementById('ddl-size');
    let numberOfCardsScoreboard = document.getElementById('ddl-size-scoreboard');
    numberOfCards.onchange = loadCards;
    numberOfCardsScoreboard.onchange = function() {
        loadScoreboard(scoreboardCompParam);
    }
    document.getElementById("time-button-scoreboard-filter").addEventListener("click", function() {
        scoreboardCompParam = "Time";
        loadScoreboard("Time");
    });
    document.getElementById("turns-button-scoreboard-filter").addEventListener("click", function() {
        scoreboardCompParam = "Turns";
        loadScoreboard("Turns");
    }); 
}
