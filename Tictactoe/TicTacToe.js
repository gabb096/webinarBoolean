const Cells = document.querySelectorAll(".Cell");

let players = [ new player("P1", "X", 0), new player("P2", "O", 0) ];

let turn = 0;
let numPlay = 0;
let cellSign = [];
let flag = 0; //this flag control if the game has started or not
let msgFlag = 1; //this flag control if the message is on screen

for(let i=0; i<Cells.length; i++)
{
    let cell = Cells[i];

    cell.addEventListener("click", function()
    {
        if(cellSign[i]) //check if the cell is already been used
            return;

        if(turn<10 && flag)
        {   
            turn++;

            let k = (turn + numPlay) % 2 // keeps track of players turn 

            let sign = players[k].sign;

            cell.innerText = sign;
            cellSign[i] = sign;

            let cW = checkWinner();

            if(cW)
            {
                turn = 10; // turn 10 means we finished the game
                showWinner(players[cW-1].name);
            }

        }
    });
}

function checkWinner()
{
    // array with possible victories
    const winningPoss = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6],  
    ];
    // check for each possibility if we have a winner
    for(let i=0; i<winningPoss.length; i++)
    {
        const combination = winningPoss[i];

        const a = combination[0];
        const b = combination[1];
        const c = combination[2];

        if(cellSign[a] && cellSign[a] === cellSign[b] && cellSign[b] === cellSign[c])  
            return winner(cellSign[a]);
    }   
    return 0;
}

function winner(w)
{
    // it controls wich player has won by checking the winnig sign
    for(let i=0; i<2; i++)
    {
        if(w == players[i].sign)
        {
            players[i].score = players[i].score + 1;
            updateScreenScore();
            return i+1; // return 1 if player1 wins or 2 if player2 wins
        }
    }
}

function showWinner(wName) // it creates a div element that will show the winner's name
{
    let newDiv = document.createElement("div");
    newDiv.innerHTML = `${wName} has won!`;
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


function newGame()
{
    if(numPlay == 0) // set all parameters for the first game
    {
        numPlay ++;
        NewGame.innerText = "New Game";
        cellSign = [];
    }
    else // reset all parameters for the next game
    {
        cellSign = [];
        turn = 0;
        numPlay ++;
    
        for(let i=0; i<Cells.length; i++)
            Cells[i].innerText = "";
        
        players[0].switchSign();
        players[1].switchSign();        
    }

    for(let j=0; j<2; j++)
    {
        if(Texts[j].value == "Insert name" || Texts[j].value == "")
        {
            players[j].name = `Player ${j+1}`;
            Texts[j].value = players[j].name;
        }
        else
        {
            players[j].name = Texts[j].value; 
            Texts[j].value = players[j].name;
        }
            
    }
    updateScreenScore();

}

function updateScreenScore()
{
    for(let i=0; i<2; i++)
        PlayerStatus[i].innerText = `Sign = ${players[i].sign} \nPoints = ${players[i].score}`; 
}

NewGame.addEventListener("click", function()
{  
    flag = 1;
    newGame();
    if(msgFlag)
        removeMessage();
});

Reset.addEventListener("click", function() 
{
    players[0].score = 0;
    players[1].score = 0;
    newGame();
});