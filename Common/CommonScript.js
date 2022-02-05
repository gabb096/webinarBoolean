/*=================== DOM =================== */
const DOM_Texts = document.querySelectorAll(".Text");
const DOM_PlayerStatus = document.querySelectorAll(".Player");
const DOM_GameArea = document.querySelector(".Game-Area");
const DOM_NewGame = document.getElementById("NewGame");
const DOM_Grid = document.getElementById(`Grid`);

let GameStartedFlag = 0; //control if the game has started or not
let msgFlag = 1; // control if the message is on screen


class playerClass 
{
    constructor(name, sign, score)
    {
        this.name = name;
        this.sign = sign;
        this.score = score;
    }
    switchSign()
    {
        if(this.sign == "X")
            this.sign = "O";
        else
            this.sign = "X";
    }
}

function updateScreenScore(P)
{
    for(let i=0; i<P.length; i++)
        DOM_PlayerStatus[i].innerText = `Points : ${P[i].score}`; 
}

function showWinner(wName) // it creates a div element that will show the winner's name
{
    let newDiv = document.createElement("div");
    
    if(wName == "It's a draw!")
        newDiv.innerHTML = wName;
    else 
        newDiv.innerHTML = `${wName} is winning!`;

    newDiv.classList.add("messageContainer");
    newDiv.id = "mesCon";
    DOM_GameArea.appendChild(newDiv);
    msgFlag = 1;
}

function removeMessage() 
{
    const mesCon = document.getElementById("mesCon");
    mesCon.parentNode.removeChild(mesCon);
    msgFlag = 0;
}

function showGenericMessage( string )
{
    if(DOM_GameArea.classList.contains("messageContainer") || msgFlag)
        removeMessage();

    let newDiv = document.createElement("div");
    newDiv.innerText = string;
    newDiv.classList.add("messageContainer");
    newDiv.id = "mesCon";
    DOM_GameArea.appendChild(newDiv);
    msgFlag = 1;
}

function showGenericTimeMessage(string, milliseconds)
{   
    showGenericMessage(string);
    setTimeout(() => {  removeMessage();   }, milliseconds);
}