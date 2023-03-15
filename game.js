
var scoreboardCompParam = "Time";
var gameTimerInterval = null;
var isGameRunning = false;
var isCardAbleToTurn = true;
var gameTurns = 0;
var gameTime = 0;

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

function updateTimer() {
    let showTimeSpan = document.getElementById("show-game-time");
    gameTime ++;
    showTimeSpan.innerHTML = gameTime;
}

function stopGameTimer() {
    clearInterval(gameTimerInterval);
    gameTimerInterval = null;
    isGameRunning = false;
    gameTime = 0;
    gameTurns = 0;
    document.getElementById("button-stop-game").innerHTML = "Reset Game";
    resetShownCards();
}

function resetGame() {
    let showTurnsSpan = document.getElementById("show-game-turns");
    let showTimeSpan = document.getElementById("show-game-time");
    clearInterval(gameTimerInterval);
    gameTimerInterval = null;
    isGameRunning = false;
    gameTime = 0;
    gameTurns = 0;
    showTurnsSpan.innerHTML = gameTurns;
    showTimeSpan.innerHTML = gameTime;
    document.getElementById("button-stop-game").innerHTML = "Stop Game";
    resetShownCards();
}

function loadCards() {
    let mainGameClass = document.getElementsByClassName('main-game-section')[0];
    let numberOfCards = document.getElementById('ddl-size');
    let cardNumbers = numberOfCards.value;
    let newCard = null;
    mainGameClass.innerHTML = null;

    for (let i = 0; i < cardNumbers; i++) {
        newCard = document.createElement("div");
        newCard.className = "card";
        newCard.appendChild(insertSvgIntoCard());
        mainGameClass.appendChild(newCard);
    }
}

function resetShownCards() {
    let allShownSvgCards = document.getElementsByClassName("svg-show-card");
    while(allShownSvgCards.length > 0){
        hideCard(allShownSvgCards[0]);
    }
}

function showCardEventListener(svgContainer) {
    let cardChildren = svgContainer.children;
    if (cardChildren.length == 1) {
        let selectedCard = cardChildren[0];
        let isCardShowing = selectedCard.getAttribute("data-isShowing");
        let showTurnsSpan = document.getElementById("show-game-turns");

        if (isCardShowing == "false") {
            showCard(selectedCard);
            if (Math.floor(gameTurns) % 2 == 1) {
                isCardAbleToTurn = false;
                setTimeout(() => {
                    resetShownCards();
                    isCardAbleToTurn = true;
                }, 1000);
            }
            gameTurns += 1;
            showTurnsSpan.innerHTML = Math.floor(gameTurns/2);
        }
    }
}

function loadCardEventListeners() {
    let allCards = document.getElementsByClassName('card');
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].addEventListener("click", function(e) {
            if (isCardAbleToTurn == true) {
                showCardEventListener(e.target);
            }
            if (gameTurns == 1) {
                isGameRunning = true;
                gameTimerInterval = setInterval(updateTimer, 1000);
            }
        });
    }
}

function showCard(card) {
    card.classList.remove("svg-hide-card");
    card.classList.add("svg-show-card");
    card.setAttribute("data-isShowing", true);
}

function hideCard(card) {
    card.classList.remove("svg-show-card");
    card.classList.add("svg-hide-card");
    card.setAttribute("data-isShowing", false);
}

function insertSvgIntoCard() {
    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let svgPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
    svgElement.classList.add("svg-hide-card");
    svgElement.setAttribute("data-isShowing", false);
    svgElement.setAttribute("data-randomColor", "#" + getRandomInt(0, 16777215).toString(16));
    svgElement.appendChild(createRandomPath(svgPath));
    return svgElement;
}

function createRandomPath(svgPathElement) {
    svgPathElement.setAttribute("d", generateRandomSvg());
    return svgPathElement;
}

function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * (min + max));
}

function generateRandomSvg() {
    let cardHeight = 55;
    let cardWidth = 80;
    let svgString = "M " + getRandomInt(-cardWidth/2, cardWidth/2) + "," + getRandomInt(-cardHeight/2, cardHeight/2) + " ";
    let numberOfVectors = getRandomInt(20, 30);

    for (let i = 0; i < numberOfVectors; i++) {
        svgString += "L" + getRandomInt(30, 200) + " " + getRandomInt(30, 200) + " ";
    }

    svgString += "z";
    return svgString;
}

function loadScoreboard(comparitionParam) {
    let scoreboardData = fakedData["scoreboard"];
    let cardsNr = document.getElementById('ddl-size-scoreboard');
    let paramColTitle = document.getElementById("scoreboard-data-comparition-type");
    let placeCounter = 1;
    let data = null;
    let paramData = null;
    paramColTitle.innerHTML = comparitionParam;

    removeElementsByClass("scoreboard-table-data");

    if (scoreboard == null) {
        return false;
    }
    for (gameData in scoreboardData) {
        data = scoreboardData[gameData];
        if (cardsNr.value == data["cards"]) {
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
    let usernameChild = document.createElement("p");
    let paramChild = document.createElement("p");
    let dateChild = document.createElement("p");

    placeChild.className = "scoreboard-table-data";
    placeChild.innerHTML = place;
    placeElement.appendChild(placeChild);

    usernameChild.className = "scoreboard-table-data";
    usernameChild.innerHTML = username;
    usernameElement.appendChild(usernameChild);

    paramChild.className = "scoreboard-table-data";
    paramChild.innerHTML = type;
    paramElement.appendChild(paramChild);

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

function setButtonsToDeafault() {
    let scoreboardSelectedButtons = document.getElementsByClassName("button-selected");
    for (let i = 0; i < scoreboardSelectedButtons.length; i++) {
        scoreboardSelectedButtons[i].className = "button-scoreboard-filter";
    }
}

window.onload = function pageonLoad() {
    loadCards();
    loadCardEventListeners();
    loadScoreboard(scoreboardCompParam);
    let numberOfCards = document.getElementById('ddl-size');
    let numberOfCardsScoreboard = document.getElementById('ddl-size-scoreboard');
    numberOfCards.onchange = function() {
        resetGame();
        loadCards();
        loadCardEventListeners();
    }
    numberOfCardsScoreboard.onchange = function() {
        loadScoreboard(scoreboardCompParam);
    }
    document.getElementById("button-stop-game").addEventListener("click", function(e) {
        if (isGameRunning == true) {
            stopGameTimer();
        }
        else if (isGameRunning == false) {
            resetGame();
        }
    })
    document.getElementById("time-button-scoreboard-filter").addEventListener("click", function(e) {
        scoreboardCompParam = "Time";
        setButtonsToDeafault();
        e.target.className = "button-selected";
        loadScoreboard("Time");
    });
    document.getElementById("turns-button-scoreboard-filter").addEventListener("click", function(e) {
        scoreboardCompParam = "Turns";
        setButtonsToDeafault();
        e.target.className = "button-selected";
        loadScoreboard("Turns");
    }); 
}
