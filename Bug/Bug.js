class BugClass
{
    constructor(d,xPos,yPos)
    {
        this.DOM_Ref = d;
        this.DOM_Ref.style.left = `${xPos}px`;
        this.DOM_Ref.style.top  = `${yPos}px`;
        this.dir = [1,1];
        this.timer = 0;
    }

    moveBug()
    {
       this.timer++;

        let x = Number(this.DOM_Ref.style.left.replace(`px`, ``));
        let y = Number(this.DOM_Ref.style.top.replace( `px`, ``));
        // Adding random variation to the path every 1 to 2 seconds
        if(this.timer > (40+Math.floor(Math.random()*41)) )
        {
            let cos = Math.cos(Math.PI/8);
            let sin = Math.sin(Math.PI/8);

            this.dir[0] = this.dir[0]*cos - this.dir[1]*sin;
            this.dir[1] = this.dir[0]*sin + this.dir[1]*cos;
            
            if(Math.abs(this.dir[0]) < 0.05)    this.dir[0] = Math.SQRT1_2;
            if(Math.abs(this.dir[1]) < 0.05)    this.dir[1] = Math.SQRT1_2;

            this.timer = 0;
        }
        // Border control
        if( x < 0 || x > gameAreaWidth)
            this.dir[0] *= -1;
        if( y < 0 || y > gameAreaHeight)
            this.dir[1] *= -1;
        // Moving the bug
        this.DOM_Ref.style.left = `${Math.round(x + 4*this.dir[0])}px`;
        this.DOM_Ref.style.top  = `${Math.round(y + 4*this.dir[1])}px`;
        // Rotating the bug image
        let angle = Math.atan(this.dir[1]/this.dir[0])+Math.PI/2;
        if(this.dir[0] < 0)
            angle += Math.PI;
    
        this.DOM_Ref.style.transform = `rotate(${angle}rad)`;
    }
}

const gameAreaWidth = DOM_GameArea.clientWidth - 50;
const gameAreaHeight = DOM_GameArea.clientHeight - 50;
const DOM_Bug = document.querySelector(".Bug");
const DOM_Time = document.getElementById("Time");
const DOM_HighScore = document.getElementById("HighScore");

let BugFlag = 0;     // Indicates if the bug is "clickable"
let newGameFlag = 1; // In case the player hits the new game "button" multiple times
let Stop = 1;
let timeLeft = 10;
let highScore = 0;
let bug = new BugClass(DOM_Bug, 30, 30);
let Player = [ new playerClass("NoName", "-", 0) ];

updateScreenScore(Player);
DOM_Time.innerText = `Time Left:\n${timeLeft}`;
DOM_NewGame.style.backgroundColor = "deeppink";

/*=================== GAME STRUCTURE ===================*/

DOM_NewGame.addEventListener("click", function()
{   
    if(newGameFlag)
    {
        Stop = 0;
        newGameFlag = 0;
        BugFlag = 0;
        Player[0].score = 0;
        DOM_NewGame.innerText = "New Game";
        DOM_NewGame.style.backgroundColor = "#0080FF";
        DOM_Time.innerText = `Time Left:\n${timeLeft}`;

        setTimeout(() => {showGenericMessage("3");},    1000);
        setTimeout(() => {showGenericMessage("2");},    2000);
        setTimeout(() => {showGenericMessage("1");},    3000);

        setTimeout(function()
        {
            BugFlag = 1; 
            timeLeft = 10;
            newGameFlag = 1;
            removeMessage();
            relocateBug();
            BugMovementTimer(); 
            gameTimer();
        }, 4000);
    }
});

DOM_Bug.addEventListener("click", function()
{
    if(timeLeft>0 && BugFlag)
    {   
        BugFlag = 0;
        DOM_Bug.classList.add(`Hit`);
        Player[0].score ++;
        updateScreenScore(Player);
        
        setTimeout(() => {    
            
            relocateBug();
            if( DOM_Bug.classList.contains(`Hit`) )
                DOM_Bug.classList.remove(`Hit`);
            
            BugFlag = 1;
            BugMovementTimer();
        }, 250);
    }
});

function BugMovementTimer() 
{
    let t = setInterval( ()  =>  
    {  
        if(BugFlag) 
            bug.moveBug();
        else 
            {
                clearInterval(t); 
                bug.dir = [0,0];
            } 
    }, 25); 
}

function gameTimer()
{
    let t = setInterval(function() 
    { 
        timeLeft--;
        DOM_Time.innerText = `Time Left:\n${timeLeft}`;

        if(timeLeft == 0 || Stop)
            {
                checkHighScore(Player[0].score);
                BugFlag = 0;
                DOM_NewGame.style.backgroundColor = "deeppink";
                clearInterval(t);
            }
    }, 1000 );
}

function checkHighScore(newScore)
{
    if(DOM_Texts[0].value == "Insert name" || DOM_Texts[0].value == null)
    {
        Player[0].name = `Player 1`;
        DOM_Texts[0].value = Player[0].name;
    }
    else
    {
        Player[0].name = DOM_Texts[0].value; 
        DOM_Texts[0].value = Player[0].name;
    }

    let mess = `${Player[0].name} has made ${Player[0].score} points!`;
    if(newScore>highScore)
        {
            highScore = newScore;
            DOM_HighScore.innerText = `HighScore ${highScore}\n by ${Player[0].name}`;
            mess +=`\n It's a new highscore :D` ;
        }
    showGenericMessage(mess);
}

function relocateBug()
{
    DOM_Bug.style.top  = `${Math.floor(Math.random() * gameAreaHeight)}px`;
    DOM_Bug.style.left = `${Math.floor(Math.random() * gameAreaWidth)}px`;
}