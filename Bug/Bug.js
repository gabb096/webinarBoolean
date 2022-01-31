class Bug
{
    constructor(d,xPos,yPos)
    {
        this.DOMref = d;
        this.DOMref.style.left = `${xPos}px`;
        this.DOMref.style.top  = `${yPos}px`;
        this.dir = [1,1];
        this.timer = 0;
    }

    moveBug()
    {
        this.timer++;

        let x = Number(this.DOMref.style.left.replace(`px`, ``));
        let y = Number(this.DOMref.style.top.replace( `px`, ``));
        // Border control
        if( x < 0 || x > gameAreaWidth)
            this.dir[0] *= -1;
        if( y < 0 || y > gameAreaHeight)
            this.dir[1] *= -1;

        // Adding random variation to the path every 1 to 2 seconds
        if(this.timer > (40+Math.floor(Math.random()*41)) )
        {
            let cos = Math.cos(Math.PI/8);
            let sin = Math.sin(Math.PI/8);

            this.dir[0] = this.dir[0]*cos - this.dir[1]*sin;
            this.dir[1] = this.dir[0]*sin + this.dir[1]*cos;
            console.log(`=>[${this.dir[0]}, ${this.dir[1]}]`);
            if(Math.abs(this.dir[0]) < 0.05)    this.dir[0] = Math.SQRT1_2;

            if(Math.abs(this.dir[1]) < 0.05)    this.dir[1] = Math.SQRT1_2;
        }
        // Moving the bug
        this.DOMref.style.left = `${Math.round(x + 4*this.dir[0])}px`;
        this.DOMref.style.top  = `${Math.round(y + 4*this.dir[1])}px`;

        // Rotating the bug image
        let angle = Math.atan(this.dir[1]/this.dir[0])+Math.PI/2;
        if(this.dir[0] < 0)
            angle += Math.PI;

        this.DOMref.style.transform = `rotate(${angle}rad)`;
    }
}

const gameAreaWidth = GameArea.clientWidth-50;
const gameAreaHeight = GameArea.clientHeight-50;
const DOMbug = document.querySelector(".Bug");

let BugFlag = 0;
let timeLeft = 10;
let Player = new player("Player1", "-", 0); 
let highScore = 0;
let bug = new Bug(DOMbug, 30, 30);

updateScreenScore(Player);

function SetTime() { return setInterval( ()=>{ if(BugFlag) bug.moveBug(); }, 25); }
let time;

// GAME TIMER
NewGame.addEventListener("click", function()
{
    let msg = "3";
    setTimeout(() => { time = SetTime();   }, 1000);
});


DOMbug.addEventListener("click", function()
{
    BugFlag=0;
    clearInterval(time);
    DOMbug.classList.add(`Hit`);
    Player.score++;

    if(timeLeft>0)
    {   
        setTimeout(() => {
            DOMbug.style.top  = `${Math.floor(Math.random()*gameAreaHeight)}px`;
            DOMbug.style.left = `${Math.floor(Math.random()*gameAreaWidth)}px`;
            BugFlag=1;
            if(DOMbug.classList.contains(`Hit`))
                DOMbug.classList.remove(`Hit`);
                time = SetTime();
        }, 500);
    }
    updateScreenScore(Player);
});