function GameBoardScene(game) {
    this.game = game;
    this.gameBoard = undefined;
    this.rules = {
        boxedLevel: true
    };
    //this.player = new Snake({
    //    game: this.game,
    //    rules: this.rules
    //
    //});

    this.mice = [];
}

/**
 * GameBoardScene extends scene
 */
GameBoardScene.__proto__ = Scene;


GameBoardScene.prototype.addAssets = function(stage) {
    this.gameBoard = this.createGameBoard(stage);
    console.log("Adding assets to Game Board");
    stage.addChild(this.gameBoard);

    //stage.addChild(this.player.geometry);
    //stage.addChild(this.mouse.geometry);

};

/**
 * This method is called for every tick.
 * This is where we move the actors around on the game board
 */
GameBoardScene.prototype.onTick = function () {
    //this.player.move();

    // TODO: Respond to controls
    //if(game.settings.controls.player1LeftKey.pressed){
    //    this.player.rotate("left");
    //}
    //if(game.settings.controls.player1RightKey.pressed){
    //    this.player.rotate("right");
    //}

    // TODO: spawn the mouse for the snake to eat

    // TODO: eat a mouse on collision

    // TODO: detect if the snake is dead

    // TODO: balance the movement of the mouse

    // Change this variable to increase or decrease occurence of mice and their behavior
    var rand = getRandomInt(1, 300);

    if(rand < 2){
        var mouse = new Mouse({
            game: this.game,
            frequency: undefined,
            rules: this.rules
        });
        this.mice.push(mouse);
        this.game.stage.addChild(mouse.geometry);
    }

    if(rand < 100){
        this.mice.forEach(function(mouse){
            mouse.move();
        });
    }
    if(rand < 5){
        this.mice.forEach(function(mouse){
            mouse.changeDirections();
        })
    }
};

GameBoardScene.prototype.createGameBoard = function(stage) {
    var squareDimensions = Math.min(stage.canvas.width, stage.canvas.height);
    var squarePosition = (stage.canvas.width - squareDimensions) / 2;
    var square = new createjs.Shape();
    //console.log(square.x, square.y);
    square.x = squarePosition;
    square.y = 0;
    square.width = square.height = squareDimensions;
    square.graphics.beginStroke("black");
    square.graphics.drawRect(0, 0, squareDimensions, squareDimensions);
    return square;
};  