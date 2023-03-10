
var scoreboardCompParam = "Time";

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

    mainGameClass.innerHTML = null;
    for (let i = 0; i < cardNumbers; i++) {
        let newCard = document.createElement("div");
        newCard.className = "card";
        newCard.innerHTML = (i + 1).toString();
        mainGameClass.appendChild(newCard);
    }
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
