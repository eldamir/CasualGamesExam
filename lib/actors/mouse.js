
function Mouse(options) {
    if (!options.game)
        throw new Error("Mouse must have the game provided");
    if (!options.rules)
        throw new Error("Mouse must have the rules provided");

    this.game = options.game;
    this.rules = options.rules;
    this.scale = 0.5;
    this.radius = 12; // As mouse is half the size, so is the radius
    this.direction = [0,1]; // Moving downward initially
    this.currentAnimation = "up"; // Initial animation
    this.alive = true;

    this.mouseSheet = new createjs.SpriteSheet(this.game.preloader.queue.getResult("mouse"));

    // The Display Object that is added to the stage
    // TODO: Fix animation studder. Mouse shouldn't move when stationary
    this.geometry = new createjs.Sprite(this.mouseSheet, this.currentAnimation);

    // Placing the mice randomly
    var bounds = this.game.currentScene.getBounds();
    var padding = 15;  // Prevents mice from spawning at the borders, getting stuck
    var randPosX = getRandomInt(bounds[0]+padding, bounds[1]-padding);
    var randPosY = getRandomInt(bounds[2]+padding, bounds[3]-padding);

    this.geometry.x = randPosX;
    this.geometry.y = randPosY;
    this.geometry.scaleX = this.geometry.scaleY = this.scale;
    this.geometry.width = this.geometry.height = 24;
    console.log("Mouse:", this.geometry.x, this.geometry.y);
}

Mouse.prototype.move = function () {
    if(this.direction[0] == 0 && this.direction[1] == 1 && this.currentAnimation != "down"){
        this.currentAnimation="down";
        this.geometry.gotoAndPlay("down")
    }
    if(this.direction[0] == 0 && this.direction[1] == -1 && this.currentAnimation != "up") {
        this.currentAnimation = "up";
        this.geometry.gotoAndPlay("up");
    }
    if(this.direction[0] == 1 && this.direction[1] == 0 && this.currentAnimation != "right") {
        this.currentAnimation = "right";
        this.geometry.gotoAndPlay("right");
    }
    if(this.direction[0] == -1 && this.direction[1] == 0 && this.currentAnimation != "left") {
        this.currentAnimation = "left";
        this.geometry.gotoAndPlay("left");
    }

    // Moving the X and Y values of the mouse
    this.geometry.x += this.direction[0];
    this.geometry.y += this.direction[1];

    if (this.rules.boxedLevel) {
        if (this.geometry.x + this.radius > this.game.currentScene.gameBoard.width + this.game.currentScene.gameBoard.x ||
            this.geometry.x - this.radius < this.game.currentScene.gameBoard.x ||
            this.geometry.y + this.radius > this.game.currentScene.gameBoard.height ||
            this.geometry.y - this.radius < 0)
            this.changeOppositeDirections(this.direction);
    } else {
        if (this.geometry.x > this.game.currentScene.gameBoard.width)
            this.geometry.x = 0;
        if (this.geometry.x < 0)
            this.geometry.x = this.game.currentScene.gameBoard.width;
        if (this.geometry.y > this.game.currentScene.gameBoard.height)
            this.geometry.y = 0;
        if (this.geometry.y < 0)
            this.geometry.y = this.game.currentScene.gameBoard.height;
    }
};

Mouse.prototype.changeDirections = function () {
    // Setting up a random direction change
    var rand = getRandomInt(1,4);
    switch (rand){
        case 1:
            this.direction = [1, 0];
            break;
        case 2:
            this.direction = [-1, 0];
            break;
        case 3:
            this.direction = [0, 1];
            break;
        case 4:
            this.direction = [0, -1];
            break;
    }
};

/**
 * Method used to change direction of the mouse if it hits the wall
 */
Mouse.prototype.changeOppositeDirections = function (direction) {
    this.direction = [this.direction[0] * -1, this.direction[1] * -1];
};