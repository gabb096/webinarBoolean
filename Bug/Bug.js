class Bug
{
    constructor(d,xPos,yPos)
    {
        this.DOMref = d;
        this.DOMref.style.top = `${xPos}px`;
        this.DOMref.style.left = `${yPos}px`;
        this.direction = [1,1];
        this.speed = 2;
    }

    moveBug()
    {
        let x = Number(this.DOMref.style.top.replace(`px`,``));
        let y = Number(this.DOMref.style.left.replace(`px`,``));

        // Border control
        if(gameAreaHeight < x || x < 0 )
            this.direction[0] =  this.direction[0] * -1;
        if( gameAreaWidth < y || y < 0 )
            this.direction[1] = this.direction[1] * -1;
        // setting the path

        //this.direction[0] = 
        x = x + (this.direction[0] + 2 * Math.cos(x/4) ) * this.speed;
        y = y + (this.direction[1] + 2 * Math.sin(x/4) ) * this.speed;

        // moving the bug
        this.DOMref.style.top = `${x}px`;
        this.DOMref.style.left = `${y}px`;
    }
}

let BugFlag = 0;

let Player = new player("Player1", "-", 0); 

const gameAreaWidth = 780;
const gameAreaHeight = 430;

PlayerStatus[0].innerText = `Points = ${Player.score}`;

let highScore = 0;
const bug1 = document.querySelector(".Bug");

let bug = new Bug(bug1,50,20);

let a;

function Timer(boo)
{
    if(boo)
    {
        a = setInterval(() => {

            if(BugFlag)
                bug.moveBug();
            else 
                console.log("Colpito!");
        }, 25);
    }
    else
        clearInterval(a);
    
    
}

bug1.addEventListener("click", function()
{
    BugFlag=0;
    Timer(0)
    bug1.classList.add(`Hit`);

    setTimeout(() => {
        bug1.style.top = `${Math.floor(Math.random()*gameAreaHeight)}px`;
        bug1.style.left = `${Math.floor(Math.random()*gameAreaWidth)}px`;
        Timer(1);
        BugFlag=1;
        if(bug1.classList.contains(`Hit`))
            bug1.classList.remove(`Hit`);
    }, 500);

});