
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
    var pos = this.getNewPosition();
    this.geometry.x = pos[0];
    this.geometry.y = pos[1];
    this.geometry.scaleX = this.geometry.scaleY = this.scale;
    this.geometry.width = this.geometry.height = 24;
    //console.log("Mouse:", this.geometry.x, this.geometry.y);
}

/**
 * Find a new random position for the mouse, making sure not to get a
 * position on top of the snake.
 */
Mouse.prototype.getNewPosition = function() {
    var bounds = this.game.currentScene.getBounds();
    var padding = 15;  // Prevents mice from spawning at the borders, getting stuck
    while (1) {
        var pos = [
            getRandomInt(bounds[0]+padding, bounds[1]-padding),
            getRandomInt(bounds[2]+padding, bounds[3]-padding)
        ];

        // Check if position is too close to the snake
        var part = this.game.currentScene.player.body.next;
        while (part.next) {
            var dummyObj = {
                radius: this.radius,
                geometry: {
                    x: pos[0],
                    y: pos[1]
                }
            };
            if (!hitTest(dummyObj, part)) {
                return pos
            }
            part = part.next;
        }
    }
    throw new Error('No new position found :O');
};

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

    // Start from the first body part, which is not the head.
    var part = this.game.currentScene.player.body.next;
    while (part.next) {
        if (hitTest(this, part)) {
            this.changeOppositeDirections(this.direction);
        }
        part = part.next;
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