function GameBoardScene(game) {
    this.game = game;
    this.gameBoard = undefined;
    this.rules = {
        boxedLevel: true
    };
    this.player = undefined;

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

    this.player = new Snake({
        game: this.game,
        rules: this.rules

    });
    stage.addChild(this.player.geometry);

    // Add two starting mice
    this.addMouse();
    this.addMouse();
};

/**
 * This method is called for every tick.
 * This is where we move the actors around on the game board
 */
GameBoardScene.prototype.onTick = function () {
    // Respond to controls
    if(game.settings.controls.player1LeftKey.pressed){
        this.player.rotate("left");
    }
    if(game.settings.controls.player1RightKey.pressed){
        this.player.rotate("right");
    }

    // Move the player
    this.player.move();

    // Spawn the mouse for the snake to eat
    this.doMouseBehaviour();

    // TODO: eat a mouse on collision
    for (var i in this.mice) {
        if (hitTest(this.player.geometry, this.mice[i].geometry)) {
            console.log("HIT")
        }
    }

    // TODO: detect if the snake is dead
};

GameBoardScene.prototype.doMouseBehaviour = function () {
    // The chances of action. The numbers are interpreted as one in FOO, e.g. spawnChance = 300 -> 1/300
    // TODO: balance the movement of the mouse
    var spawnChance = 300;
    var moveChance = 5;
    var changeDirectionChance = 75;

    if(getRandomInt(spawnChance) == 0){
        this.addMouse();
    }

    if(getRandomInt(moveChance) == 0){
        this.mice.forEach(function(mouse){
            mouse.move();
        });
    }
    if(getRandomInt(changeDirectionChance) == 0){
        this.mice.forEach(function(mouse){
            mouse.changeDirections();
        })
    }
};

GameBoardScene.prototype.addMouse = function () {
    var mouse = new Mouse({
        game: this.game,
        frequency: undefined,
        rules: this.rules
    });
    this.mice.push(mouse);
    this.game.stage.addChild(mouse.geometry);
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

/**
 * Returns the bounds of the gameboard in the following order:
 * * The leftmost x position
 * * The rightmost x position
 * * The topmost y position
 * * The bottommost y position
 * @returns {*[]}
 */
GameBoardScene.prototype.getBounds = function () {
    return [this.gameBoard.x, this.gameBoard.width, this.gameBoard.y, this.gameBoard.height]
};