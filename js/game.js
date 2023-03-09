
function loadCards() {
    let mainGameClass = document.getElementsByClassName('main-game-section')[0];
    let numberOfCards = document.getElementById('ddl-size');
    console.log(numberOfCards.value);
    let cardNumbers = numberOfCards.value;

    mainGameClass.innerHTML = null;
    for (let i = 0; i < cardNumbers; i++) {
        let newCard = document.createElement("div");
        newCard.className = "card";
        newCard.innerHTML = (i + 1).toString();
        mainGameClass.appendChild(newCard);
    }
}

window.onload = function pageonLoad() {
    loadCards();
    let numberOfCards = document.getElementById('ddl-size');
    numberOfCards.onchange = loadCards;
}
