class Bug
{
    constructor(d,xPos,yPos)
    {
        this.DOMref = d;
        this.DOMref.style.left   = `${xPos}px`;
        this.DOMref.style.bottom = `${yPos}px`;
        this.direction = [1,1];
        this.speed = 2;
        this.deg = 0;
        this.angle = Math.PI/4; // this qill controll the speed
    }

    moveBug()
    {
        let adj = 0;
        let x = Number(this.DOMref.style.left.replace(`px`, ``));
        let y = Number(this.DOMref.style.bottom.replace(`px`, ``));
        // Checking the borders
        if(gameAreaWidth < x || x < 0)
            this.direction[0] *= -1;
        if(gameAreaHeight < y || y < 0)
            this.direction[1] *= -1;
        // Calculating the angle of rotation based on the quadrant
        if( this.direction[1] < 0 )  
            adj = Math.PI;
        else 
            if( this.direction[0] < 0 )  
                adj = 2 * Math.PI;
        this.deg = Math.floor( 180 / Math.PI * ( Math.atan(this.direction[1]/this.direction[0]) + adj ) );
        // Moving  and rotating the bug
        this.DOMref.style.left   = `${x + ( this.direction[0] * this.speed )}px`;
        this.DOMref.style.bottom = `${y + ( this.direction[1] * this.speed )}px`;
        this.DOMref.style.transform = `rotate(${this.deg}deg)`;
    }
}

const gameAreaWidth = 780;
const gameAreaHeight = 430;
const bug1 = document.querySelector(".Bug");

let BugFlag = 0;
let timeLeft = 10;
let Player = new player("Player1", "-", 0); 
let highScore = 0;
let bug = new Bug(bug1, 30, 400);

PlayerStatus[0].innerText = `Points = ${Player.score}`;

bug1.addEventListener("click", function()
{
    BugFlag=0;
    Timer(0)
    bug1.classList.add(`Hit`);
    Player.score++;

    if(timeLeft>0)
    {   
        setTimeout(() => {
            // bug1.style.bottom = `${Math.floor(Math.random()*gameAreaHeight)}px`;
            // bug1.style.left = `${Math.floor(Math.random()*gameAreaWidth)}px`;
            Timer(1);
            BugFlag=1;
            if(bug1.classList.contains(`Hit`))
                bug1.classList.remove(`Hit`);
        }, 500);
    }
    PlayerStatus[0].innerText = `Points = ${Player.score}`;
});

function Timer(bool)
{
    let a;

    if(bool)
        a = setInterval( ()=>{ if(BugFlag) bug.moveBug(); }, 25);
    else
        clearInterval(a);
}

let t = setInterval(() => {
    if(timeLeft)
        timeLeft--;
    else
    {
        clearInterval(t);
        Timer(0);
    }    
    console.log(`${timeLeft}`);
}, 1000);

