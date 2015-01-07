
function Snake(options) {
    if (!options.game)
        throw new Error("Snake must have the game provided");
    if (!options.rules)
        throw new Error("Snake must have the rules provided");
    this.game = options.game;
    this.rules = options.rules;
    this.direction = [0,1];
    this.velocity = options.velocity ? options.velocity : 2;
    this.scale = 1;
    this.alive = true;
    this.radius = 20;

    // The Display Object that is added to the stage
    var snakeSheet = new createjs.SpriteSheet(this.game.preloader.queue.getResult("snake"));
    this.geometry = new createjs.Sprite(snakeSheet, "head");
    this.geometry.x = this.game.stage.canvas.width / 2;
    this.geometry.y = this.game.stage.canvas.height / 2;
    this.geometry.scaleX = this.geometry.scaleY = this.scale;
    this.geometry.width = this.geometry.height = 64;
    console.log("Snake:", this.geometry.x, this.geometry.y)
}

Snake.prototype.move = function () {
    if (this.alive) {
        this.geometry.x += this.direction[0] * this.velocity;
        this.geometry.y -= this.direction[1] * this.velocity;

        if (this.rules.boxedLevel) {
            if (this.geometry.x + this.radius > this.game.currentScene.gameBoard.width ||
                this.geometry.x - this.radius < 0 ||
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
    }
};

Snake.prototype.collidesWith = function (other) {

};