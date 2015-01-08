
function Snake(options) {
    if (!options.game)
        throw new Error("Snake must have the game provided");
    if (!options.rules)
        throw new Error("Snake must have the rules provided");
    this.game = options.game;
    this.rules = options.rules;
    this.scale = 1;
    this.alive = true;
    this.radius = 20;
    this.rotationSpeed = 3.0;

    this.body = [];
    var velocity = options.velocity ? options.velocity : 2;

    this.snakeSheet = new createjs.SpriteSheet(this.game.preloader.queue.getResult("snake"));

    // Create snake bodyparts
    var bodyParts = 5;

    for (var i = 0; i < bodyParts; i++) {
        this.addPart()
    }

    // The Display Object that is added to the stage
    this.geometry = createjs.Container();

    this.geometry = new createjs.Sprite(snakeSheet, "head");
    this.geometry.x = this.game.stage.canvas.width / 2;
    this.geometry.y = this.game.stage.canvas.height / 2;
    this.geometry.scaleX = this.geometry.scaleY = this.scale;
    this.geometry.width = this.geometry.height = 40;
    console.log("Snake:", this.geometry.x, this.geometry.y)
}

// TODO: Finish this
/**
 * Adds a bodypart to the snake.
 * This method will resolve what kind of bodypart to add: head, body, or tail.
 * The method also makes sure that every part of the snake knows how to move
 */
Snake.prototype.addPart = function () {
    var geometry;
    var index = this.body.length;
    if (this.body.length == 0) {
        geometry = new createjs.Sprite(this.snakeSheet, "head");
    } else if (this.body.length == 1) {
        geometry = new createjs.Sprite(this.snakeSheet, "tail");
    } else {
        geometry = new createjs.Sprite(this.snakeSheet, "body");
        index -= 1;
    }

    geometry.x = this.game.currentScene.gameBoard.width / 2;
    geometry.y = this.game.currentScene.gameBoard.height / 2;
    geometry.scaleX = this.geometry.scaleY = this.scale;
    geometry.width = this.geometry.height = 40;
    geometry.radius = 20;

    this.body.splice(index, 0, {
        position: [
            this.game.stage.canvas.width / 2,
            this.game.stage.canvas.height / 2
        ],
        direction: [0,-1],
        velocity: velocity,
        geometry: new createjs.Sprite(snakeSheet, "head"),
        nextCommand: {
            x:0,
            y:0,
            rotation: 0,
            velocity: velocity
        }
    })
};

Snake.prototype.move = function () {
    if (!this.alive)
        return;
    this.geometry.x += this.direction[0] * this.velocity;
    this.geometry.y += this.direction[1] * this.velocity;

    if (this.rules.boxedLevel) {
        if (this.geometry.x + this.radius > this.game.currentScene.gameBoard.width + this.game.currentScene.gameBoard.x ||
            this.geometry.x - this.radius < this.game.currentScene.gameBoard.x ||
            this.geometry.y + this.radius > this.game.currentScene.gameBoard.height ||
            this.geometry.y - this.radius < 0)
            this.alive = false;  // TODO: Kill the player
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

Snake.prototype.rotate = function (direction) {
    if(!this.alive)
        return;
    // Changing orientation 3 degrees per tick
    var degrees = this.rotationSpeed;
    if (direction == "left"){
        // Decrease rotation direction for left press
        degrees *= -1;
    }
    // Rotation visible geometry
    this.geometry.rotation += degrees;
    this.direction = getRotatedVector(this.direction, degrees);
}

Snake.prototype.collidesWith = function (other) {

};