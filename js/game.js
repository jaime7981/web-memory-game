
var scoreboardCompParam = "Time";
var gameTimerInterval = null;
var isGameRunning = false;
var isCardAbleToTurn = true;
var lastSelectedCard = null;
var gameTurns = 0;
var gameTime = 0;

var scoreboardLocalStorage = {
    "scoreboard":[]
};

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

function checkGameEnd() {
    let allCards = document.getElementsByClassName("card");
    let gameInfo = document.getElementById("game-info-span");
    if (allCards.length == 0) {
        gameInfo.innerHTML = "Time: " + gameTime + " Turns:" + Math.floor(gameTurns/2) + ", click to restart";
        addDataIntoScoreboard();
        loadScoreboard(scoreboardCompParam);
        resetGame();
        loadCards();
        loadCardEventListeners();
    }
}

function loadCards() {
    let mainGameClass = document.getElementsByClassName('main-game-section')[0];
    let numberOfCards = document.getElementById('ddl-size');
    let cardNumbers = numberOfCards.value;
    let newCard = null;
    let svgElement = null;
    let svgPath = null;
    let cardList = [];
    mainGameClass.innerHTML = null;

    for (let i = 0; i < cardNumbers/2; i++) {
        svgPath = generateRandomSvg();
        for (let j = 0; j < 2; j++) {
            newCard = document.createElement("div");
            newCard.className = "card";
            svgElement = insertSvgIntoCard(svgPath);
            newCard.setAttribute("data-card-id", i*2 + j);
            newCard.setAttribute("data-pair-id", i);
            newCard.setAttribute("data-card-deleted", false);
            newCard.appendChild(svgElement);
            cardList.push(newCard);
        }
    }

    cardList.sort(() => Math.random() - 0.5);
    cardList.sort(() => Math.random() - 0.5);

    for (let i = 0; i < cardList.length; i++) {
        mainGameClass.appendChild(cardList[i]);
    }
}

function resetShownCards() {
    let allShownSvgCards = document.getElementsByClassName("svg-show-card");
    while(allShownSvgCards.length > 0){
        hideCard(allShownSvgCards[0]);
    }
    lastSelectedCard = null;
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

            if (lastSelectedCard != null) {
                if (svgContainer.getAttribute("data-pair-id") == lastSelectedCard.getAttribute("data-pair-id")) {
                    svgContainer.className = "card-delete";
                    lastSelectedCard.className = "card-delete";
                    svgContainer.setAttribute("data-card-deleted", true);
                    lastSelectedCard.setAttribute("data-card-deleted", true);
                    checkGameEnd();
                }
            }

            lastSelectedCard = svgContainer;
        }
    }
}

function loadCardEventListeners() {
    let allCards = document.getElementsByClassName('card');
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].addEventListener("click", function(e) {
            if (isCardAbleToTurn == true && e.target.getAttribute("data-card-deleted") == "false") {
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

function insertSvgIntoCard(randomSvgPath) {
    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let svgPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
    svgPath.setAttribute("d", randomSvgPath)
    svgElement.classList.add("svg-hide-card");
    svgElement.setAttribute("data-isShowing", false);
    svgElement.setAttribute("data-randomColor", "#" + getRandomInt(0, 16777215).toString(16));
    svgElement.appendChild(svgPath);
    return svgElement;
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
    let scoreboardData = scoreboardLocalStorage["scoreboard"];
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
        if (placeCounter > 3) {
            return true;
        }
    }
    return true;
}

function addDataIntoScoreboard() {
    let scoreboardData = scoreboardLocalStorage["scoreboard"];
    let username = document.getElementById("username-input").value;
    let time = gameTime;
    let turns = Math.floor(gameTurns/2);
    let cards = document.getElementById('ddl-size').value;
    let date = new Date().toJSON().slice(0, 19);

    if (username == "") {
        username = "default";
    }

    let newData = {"username":username,
    "time":time,
    "turns":turns,
    "cards":parseInt(cards),
    "date":date};

    scoreboardData.push(newData);
    localStorage.setItem("scoreboardArray", JSON.stringify(scoreboardData));
}

function loadScoreboardData() {
    if (scoreboardLocalStorage["scoreboard"] != null) {
        scoreboardLocalStorage["scoreboard"] = JSON.parse(localStorage.getItem("scoreboardArray"));
    }
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

function changeCssColors() {
    if (localStorage.getItem("darkMode") == true) {
        return true;
    }

    return false;
}

window.onload = function pageonLoad() {
    loadCards();
    loadCardEventListeners();
    loadScoreboardData();
    loadScoreboard(scoreboardCompParam);

    let numberOfCards = document.getElementById('ddl-size');
    let numberOfCardsScoreboard = document.getElementById('ddl-size-scoreboard');
    let darkMode = document.getElementById('ddl-dark-mode');
    darkMode.value = localStorage.getItem("darkMode");
    changeCssColors();

    numberOfCards.onchange = function() {
        resetGame();
        loadCards();
        loadCardEventListeners();
    }
    numberOfCardsScoreboard.onchange = function() {
        loadScoreboard(scoreboardCompParam);
    }
    darkMode.onchange = function(e) {
        localStorage.setItem("darkMode", e.target.value);
        changeCssColors();
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
