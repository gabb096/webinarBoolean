const ImgDim = 60;
let duckPos  = [150, 0];
let plantPos = [750, 0]
let speed = 6;
let highScore = 0;
let jumpFlag = 0;
let gameOverFlag = 0;
newGameFlag = 1;

let player = [new playerClass("Player1","-",0)];

DOM_NewGame.style.backgroundColor = "deeppink";

DOM_Duck = document.querySelector(".duck");
DOM_Duck.style.left = `${duckPos[0]}px`;
DOM_Duck.style.bottom = `${duckPos[1]}px`;

DOM_Plant = document.querySelector(".plant");
DOM_Plant.style.left = `${plantPos[0]}px`;
DOM_Plant.style.bottom = `${plantPos[1]}px`;

updateScreenScore(player);

document.body.onkeydown = function(e){
    if(e.keyCode == 32 && jumpFlag) // check if space bar is pressed
        duckJump();
    if(e.keyCode == 13) // check if enter is pressed
        NewGame();
}

DOM_NewGame.addEventListener("click", NewGame);

let gameTimer;
function StartGame()
{
    gameTimer = setInterval(() => {
        // Randomizzare quanto tempo ci mette per far comparire la nuovaa pianta
        // Usare più piante 
        if(plantPos[0]<0) 
            plantPos[0] = 750;
    
        movePlant(plantPos[0]);
        checkCollision();
    }, 30);
}

let t;
function duckJump()
{
    jumpFlag = 0;
    let time = 0;

    t = setInterval(() => {
        time++;
        if(time<11)    duckPos[1] = Math.sin(time/20 * Math.PI)*(ImgDim+10);
        
        if(time == 11)    duckPos[1] = ImgDim+10;

        if(time > 25)    duckPos[1] = Math.cos((time-25)/18 * Math.PI)*(ImgDim+10);

        if(time == 34) 
        {
            clearInterval(t);
            jumpFlag = 1;
        }

        DOM_Duck.style.bottom =`${duckPos[1]}px`;
    }, 30);

}
// Cambiare velocità se aumentano i punti
function movePlant() {  DOM_Plant.style.left = `${plantPos[0]-= speed}px`; }

function checkCollision()
{
    if( plantPos[0]<duckPos[0]+ImgDim-10 && plantPos[0]+ImgDim-10 > duckPos[0] && duckPos[1] < ImgDim -5 )
    {
        if(dist( duckPos[0]+ImgDim/2, plantPos[0]+ImgDim/2, duckPos[1]+ImgDim/2, plantPos[1]+ImgDim/2 ) <= ImgDim)
        {
            clearInterval(t);
            clearInterval(gameTimer);
            jumpFlag = 0;
            gameOver();
            checkHighScore(player[0].score);
        }
    }
    else
    {
        player[0].score += Math.ceil((plantPos[0])/DOM_GameArea.clientWidth);
        updateScreenScore(player);
    }
}

function gameOver()
{
    DOM_NewGame.style.backgroundColor = "deeppink";
    showGenericMessage(`Game Over\nYou score ${player[0].score} points!`);
    gameOverFlag = 1;
    newGameFlag = 1;
}

function resetGame()
{
    DOM_Duck.style.bottom = `${0}px`;
    DOM_Plant.style.left = `${plantPos[0]=750}px`;

    player[0].score = 0;
    updateScreenScore(player);
    newGameFlag = 1;
    removeMessage();
}

function dist(x1,x2,y1,y2) // euclidean distance between the points (x1,y1) and (x2,y2)
{
    return Math.sqrt( (x2-x1)**2 + (y2-y1)**2 );
}

function NewGame()
{
    if(newGameFlag) // Preparing the new game
    {
        resetGame();
        newGameFlag = 0;
        jumpFlag = 0;
        DOM_NewGame.innerText = "New Game";
        DOM_NewGame.style.backgroundColor = "#0080FF";
        showGenericMessage("3")
        setTimeout(() => {showGenericMessage("2");},    1000);
        setTimeout(() => {showGenericMessage("1");},    2000);
    
        setTimeout(function()
        {
            jumpFlag = 1;
            removeMessage();
            StartGame();
        }, 3000);
    }
}

function checkHighScore(newScore)
{
    if(newScore>highScore)
        highScore = newScore;

    DOM_HighScore.innerText = `Highscore:${highScore}`;

}