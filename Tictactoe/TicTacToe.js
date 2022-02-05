const DOM_Cells = document.querySelectorAll(".Cell");

let players = [ new playerClass("P1", "X", 0), new playerClass("P2", "O", 0) ];
let turn = 0;
let numPlay = 0;
let cellSign = [];


for(let i=0; i<DOM_Cells.length; i++)
{
    let cell = DOM_Cells[i];

    cell.addEventListener("click", function()
    {
        if(cellSign[i]) //Check if the cell is already been used
            return;

        if(turn<10 && GameStartedFlag)
        {   
            turn++;

            let k = (turn + numPlay) % 2 // Keeps track of players turn 

            let sign = players[k].sign;

            cell.innerText = sign;
            cellSign[i] = sign;

            let cW = checkWinner();
            if(cW)
            {              
                showGenericMessage(`${players[cW-1].name} has won!`)  
                turn = 10; 
            }
        }
        if(turn==9)// At turn 9 there is the last move
        {
            showGenericMessage("It's a draw!")
        }
    });
}

function checkWinner()
{
    // Array with possible victories
    const winningPoss = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6],  
    ];
    // Check for each possibility if we have a winner
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
    // Controls wich player has won by checking the winnig sign
    for(let i=0; i<2; i++)
    {
        if(w == players[i].sign)
        {
            players[i].score = players[i].score + 1;
            ticTacToe_UpdateScreenScore();
            return i+1; // Return 1 if player1 wins or 2 if player2 wins
        }
    }
}

function newGame()
{
    if(numPlay == 0) // Set all parameters for the first game
    {
        numPlay ++;
        DOM_NewGame.innerText = "New Game";
        cellSign = [];
    }
    else // Reset all parameters for the next game
    {
        cellSign = [];
        turn = 0;
        numPlay ++;
    
        for(let i=0; i<DOM_Cells.length; i++)
            DOM_Cells[i].innerText = "";
        
        players[0].switchSign();
        players[1].switchSign();        
    }

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
    ticTacToe_UpdateScreenScore();
}

function ticTacToe_UpdateScreenScore()
{
    for(let i=0; i<2; i++)
        DOM_PlayerStatus[i].innerText = `Sign = ${players[i].sign} \nPoints = ${players[i].score}`; 
}

DOM_NewGame.addEventListener("click", function()
{  
    GameStartedFlag = 1;
    newGame();
    if(msgFlag)
        removeMessage();
});

Reset.addEventListener("click", function() 
{
    showGenericMessage("Game resetted");

    for(let i=0; i<players.length; i++)
    {
        players[i].score = 0;
        players[i].name = `Player ${i+4}`;
    }
    
    setTimeout(() => {
        GameStartedFlag = 1;
        newGame();
        if(msgFlag)
            removeMessage();
    }, 1000);  
});