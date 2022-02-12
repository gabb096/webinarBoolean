/*=================== GAME STRUCTURE ===================*/
const row = 4;
const colums = 8;
const cards = [`alien`, `bug`, `duck`, `rocket`, `spaceship`, `tiktac`];
let deck = [...cards,...cards,...cards,...cards,`alien`, `bug`, `duck`, `rocket`, `alien`, `bug`, `duck`, `rocket`]
let pick = [];

/*=================== PLAYERS ===================*/

let players = [new playerClass(`P1`, `-`, 0), new playerClass(`P2`, `-`, 0)];
let currentPlayer = 0;
/*=================== GAME LOGIC ===================*/

for(let i=0; i<deck.length; i++) // add cards to grid in game area
{
    const card = document.createElement(`div`);
    card.classList.add(`Card`);
    card.setAttribute(`data-card`, deck[i]);
    card.addEventListener(`click`, flipCard);
    DOM_Grid.appendChild(card);
}   

updateScreenScore(players);
shuffleDeck();

DOM_Texts[currentPlayer].style.backgroundColor = "deeppink";

function flipCard(e) {
    
    if(GameStartedFlag)
    {
        const card = e.target;
        if(card.classList.contains(`flipped`))  return;

        card.classList.add(card.getAttribute(`data-card`), `flipped`);
        pick.push(card);
        if(pick.length === 2)
            if(checkMatch()) { checkWinner(); }
    }   
}

function checkMatch() 
{
    const card1 = pick[0];
    const card2 = pick[1];
    const cardName1 = card1.getAttribute(`data-card`);
    const cardName2 = card2.getAttribute(`data-card`);
    
    if(cardName1 === cardName2)
    {
        players[currentPlayer].score += 1;
        updateScreenScore(players);
        pick = [];
        return 1;
    }
    else
    {
        setTimeout(function() {
            card1.classList.remove( cardName1, `flipped`);
            card2.classList.remove( cardName2, `flipped`);
        }, 600);
        DOM_Texts[currentPlayer].style.backgroundColor = "#0080FF";
        currentPlayer = (currentPlayer + 1) % 2;
        DOM_Texts[currentPlayer].style.backgroundColor = "deeppink";
        pick = [];
        return 0;
    }
    
}

DOM_NewGame.addEventListener("click", function()
{  
    GameStartedFlag = 1;
    DOM_NewGame.innerText = `New Game`;
    newGame();
    if(msgFlag)
        removeMessage();
});

Reset.addEventListener("click", function() 
{
    players[0].score = 0;
    players[1].score = 0;
    updateScreenScore(players);
    newGame();
});

function shuffleDeck() {  deck.sort( function(){ return Math.round(0.5 - Math.random()); } ); }

function placeNewCards(){
    
    const card = document.querySelectorAll(`.Card`);

    for(let i=0; i<deck.length; i++) // add cards to grid in game area
    {
        card[i].classList.remove(`flipped`, card[i].getAttribute(`data-card`));
        card[i].setAttribute(`data-card`, deck[i]);
    }   
}

function newGame(){
    shuffleDeck();
    placeNewCards();
    for(let j=0; j<2; j++)
    {
        if(DOM_Texts[j].value == "Insert name" || DOM_Texts[j].value == "")
        {
            players[j].name = `Player ${j+1}`;
            DOM_Texts[j].value = players[j].name;
        }
        else
        {
            players[j].name = DOM_Texts[j].value; 
            DOM_Texts[j].value = players[j].name;
        }
            
    }
}

function checkWinner(){
    
    let k = 0;
    const DOM_card = document.querySelectorAll(`.Card`);

    for(let i=0; i<deck.length; i++)
    {
        if(DOM_card[i].classList.contains(`flipped`))
            k++;
    }
    if(k<deck.length-1)
        return;

    if(players[0].score > players[1].score)
        showGenericMessage(`${players[0].name} has won!`);
        else
        {
            if (players[1].score > players[0].score)
                showGenericMessage(`${players[0].name} has won!`);
            else   
                showGenericMessage("It's a draw!");
        }
}