/*=================== DOM =================== */
const Texts = document.querySelectorAll(".Text");
const PlayerStatus = document.querySelectorAll(".Player");
const GameArea = document.querySelector(".Game-Area");
const NewGame = document.getElementById("NewGame");
const Grid = document.getElementById(`Grid`);

class player 
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

function updateScreenScore(Players)
{
    for(let i=0; i<Players.length; i++)
        PlayerStatus[i].innerText = `Points = ${Players[i].score}`; 
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
    GameArea.appendChild(newDiv);
    msgFlag = 1;
}

function removeMessage() 
{
    const mesCon = document.getElementById("mesCon");
    mesCon.parentNode.removeChild(mesCon);
    msgFlag = 0;
}