var myGamePiece;
var myObstacles = [];
var clouds = [];
var lands = [];
var myScore;

function startGame() {
    myGamePiece = new component(40, 40, "dino_walk.gif", 10, 120, "image");
    myGamePiece.gravity = 0.6;
    myScore = new component("300px", "Press", "Start 2P", 200, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 700;
        this.canvas.height = 200;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.score = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.interval = setInterval(updateGameScore, 100);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;  
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;

    if (type == "image") {
        this.image = new Image();
        this.image.src = "./images/dino_walk_1.svg";
    }
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            //ctx.font = "Press Start 2P";
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else if (type == "image") {
            
            if (color == "dino_walk.gif") {
                if(myGameArea.score % 2 == 0) {
                    this.image.src = "./images/dino_walk_1.svg";
                }
                else {
                    this.image.src = "./images/dino_walk_2.svg";
                }
            }
            else {
                this.image.src = color
            }
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.y += this.gravitySpeed;
        this.hitBottom();
    
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.crashEvent = function() {
        this.image.src = "./images/dino_crash.svg";

        ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
    }
}

function updateGameArea() {
    var x, y, height, size;
    var intervalValue = getRandomIntBetween(1, 71)
    var intervalCloudValue = getRandomIntBetween(1, 67)
    var intervalLandValue = getRandomIntBetween(1, 60)
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGamePiece.crashEvent()
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || (intervalValue % 71 == 0)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height;
        height = getRandomIntBetween(40, 55);
        width = getRandomIntBetween(20, 25);
        myObstacles.push(new component(width, height, "./images/obstical_cactus.svg", x, y - height, "image"));
    }

    if (myGameArea.frameNo == 1 || (intervalCloudValue % 67 == 0)) {
        x = myGameArea.canvas.width;
        y = getRandomIntBetween(20, 80);
        height = getRandomIntBetween(20, 25);
        width = getRandomIntBetween(60, 65);
        clouds.push(new component(width, height, "./images/cloud.svg", x, y, "image"));
    }

    if (myGameArea.frameNo == 1 || (intervalLandValue % 3 == 0)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height;
        if (intervalLandValue == 33) {
            height = 12;
            width = 60;
            lands.push(new component(width, height, "./images/land_bump.svg", x, y - 15, "image"));
        }
        else {
            height = 5;
            width = 100;
            lands.push(new component(width, height, "./images/land_normal.svg", x, y - 10, "image"));
        }
    }

    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -4;
        myObstacles[i].update();
    }

    for (i = 0; i < clouds.length; i += 1) {
        clouds[i].x += -2;
        clouds[i].update();
    }

    for (i = 0; i < lands.length; i += 1) {
        lands[i].x += -4;
        lands[i].update();
    }
    
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function getRandomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function accelerate(n) {
    myGamePiece.gravity = n;
}

function updateGameScore() {
    myGameArea.score += 1
    myScore.text=`
        SCORE: ${myGameArea.score}
        GRAVITY: ${myGamePiece.gravity}
        GRAVITYSPEED: ${myGamePiece.gravitySpeed}
        Y: ${(myGamePiece.y / myGameArea.canvas.height) * 100}
    `//"SCORE: " + myGameArea.score;
}


function handleKeyDown(event) {
    switch (event.code) {
        case 'Space':
            accelerate(-0.9)
        break;
        case 'ArrowUp':
            accelerate(-0.9)
        break;
    }
}

function handleKeyUp(event) {
    switch (event.code) {
        case 'Space':
            accelerate(0.9)
        break;
        case 'ArrowUp':
            accelerate(0.9)
        break;
    }
}