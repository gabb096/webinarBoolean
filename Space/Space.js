class laser
{
    constructor(xpos)
    {
        this.Y = 40;
        this.X = xpos;
        this.newShot = document.createElement("div");
        this.newShot.classList.add("space");
        this.newShot.classList.add("laser");
        DOM_GameArea.appendChild(this.newShot);
        this.newShot.style.left = `${this.X}px`;
        this.newShot.style.bottom = `${this.Y}px`;
    }
    move() {   this.newShot.style.bottom = `${this.Y+=10}px`;   }
    
    remove(){   this.newShot.parentNode.removeChild(this.newShot);   }
}

class alienShip
{
    constructor(xpos, ypos)
    {
        this.X = xpos;
        this.Y = ypos;
        this.speed = 5;

        this.newAlienShip = document.createElement("div");
        this.newAlienShip.classList.add("space");
        this.newAlienShip.classList.add("alien");
        DOM_GameArea.appendChild(this.newAlienShip);
        this.newAlienShip.style.left = `${xpos}px`;
        this.newAlienShip.style.top = `${ypos}px`;
    }
    move() 
    {
        this.newAlienShip.style.left = `${this.X+=this.speed}px`; 
        if( this.X > MaxWidth-imgDim || this.X < 0)
        {
            this.speed *= -1;
            this.newAlienShip.style.top = `${this.Y +=imgDim+15}px`; 
        }
        else if( this.Y > MaxHeight-imgDim) gameOver(); 
    }

    remove(){ this.newAlienShip.parentNode.removeChild(this.newAlienShip); }
}

let MaxWidth = DOM_GameArea.clientWidth;
let MaxHeight = DOM_GameArea.clientHeight;
let imgDim = 50;
let ShipInfo = [MaxWidth/2-imgDim, 5, 5]; // x position, y position, speed
let shots = [];
let aliensFleet = [];
let newGameFlag = true;
let gameTimer;
let shotingFlag = true;

setAlienFleet(24);

DOM_SpaceShip = document.querySelector(".ship");
DOM_SpaceShip.style.left = `${ShipInfo[0]}px`;
DOM_SpaceShip.style.bottom = `${ShipInfo[1]}px`;

DOM_NewGame.style.backgroundColor = "deeppink";

let player = [new playerClass("Player1","-",0)];
let timer;
let isPressed = false;

document.body.onkeydown = function(e)
{    
    if(!isPressed)
    {
        isPressed = true;
    // Ship movement
        if((e.key == "ArrowLeft" || e.key == "a") && ShipInfo[0] > 0) 
            timer = setInterval(() => {   
                if( ShipInfo[0] > 0)
                    DOM_SpaceShip.style.left = `${ShipInfo[0]-=ShipInfo[2] }px`; 
            }, 25); 

        if((e.key == "ArrowRight" || e.key == "d") && ShipInfo[0] < MaxWidth-imgDim) 
            timer = setInterval(() => {  
                if( ShipInfo[0] < MaxWidth-imgDim) 
                    DOM_SpaceShip.style.left = `${ShipInfo[0]+=ShipInfo[2] }px`; 
            }, 25); 

        if(e.keyCode == 13) // Enter is pressed
            gameTimer = NewGame();
    
        if(e.keyCode == 32 && shotingFlag) // Space bar is pressed
        {
            shotingFlag = false;
            shoot();
            setTimeout(() => { shotingFlag = true; }, 500); // Limiting the fire power of the ship
        }
    }
}

document.body.onkeyup = function(e)
{  
    isPressed = false;
    clearInterval(timer);
}

DOM_NewGame.addEventListener("click", () => { gameTimer = NewGame(); } );

function StartGame()
{
    gameTimer = setInterval(() => {
        
        if(shots.length)
        {
            for(let i = 0; i<shots.length; i++)
            {
                shots[i].move();
                let boom = checkCollision(i);

                if(boom[0])
                {
                    shots[i].remove(); 
                    shots.splice(i, 1);
                    // aliensFleet[boom[1]].speed = 0;
                    aliensFleet[boom[1]].newAlienShip.classList.remove("alien");
                    aliensFleet[boom[1]].newAlienShip.classList.add("boom");
                    
                    player[0].score++;
                    updateScreenScore(player);

                    setTimeout(() => {
                        aliensFleet[boom[1]].remove(); 
                        aliensFleet.splice(boom[1], 1);
                    }, 250);
                    

                }

                if( !boom[0] && shots[i].Y >= MaxHeight-2*imgDim/3)
                {
                    shots[i].remove(); 
                    shots.splice(i, 1);
                }
            }
        }
        if(aliensFleet.length)
        {
            for(let i = 0; i<aliensFleet.length; i++)
            {
                aliensFleet[i].move();
            }
        }
    }, 30);
}

function gameOver()
{
    DOM_NewGame.style.backgroundColor = "deeppink";
    showGenericMessage(`Game Over\nYou score ${player[0].score} points!`);
    gameOverFlag = true;
    newGameFlag = true;
    clearInterval(gameTimer);
}

function resetGame()
{
    player[0].score = 0;
    updateScreenScore(player);
    newGameFlag = true;
    removeMessage();
}

function NewGame()
{
    if(newGameFlag) // Preparing the new game
    {
        resetGame();
        newGameFlag = false;
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

function shoot()
{
    if(!newGameFlag)
        shots.push(new laser(ShipInfo[0]));
}

function setAlienFleet(n)
{
    let row = Math.floor(n/16);

        for(let i=0; i < 16; i++)
        {
            for(let j=0; j<=row; j++)
            {
                aliensFleet.push( new alienShip( i*imgDim+15, (imgDim)*j ) );
            }    
        }
}

function checkCollision(laser)
{
    let j, d;

    for(j=0; j<aliensFleet.length; j++)
    {
        d = dist(shots[laser].X + imgDim/2, 
                aliensFleet[j].X + imgDim/2, 
                shots[laser].Y + 2*imgDim/3, 
                MaxHeight - aliensFleet[j].Y + imgDim/2);
        
        if(d < imgDim - 15)
            return [true, j];
    }
    
    return [false, 0];
}
