function GameBoardScene(game) {
    this.game = game;
    this.gameBoard = undefined;
}

/**
 * GameBoardScene extends scene
 */
GameBoardScene.__proto__ = Scene;


GameBoardScene.prototype.addAssets = function(stage) {
    this.gameBoard = this.createGameBoard(stage);
    console.log("Adding assets to Game Board");
    stage.addChild(this.gameBoard);


};

GameBoardScene.prototype.createGameBoard = function(stage) {
    var squareDimensions = Math.min(stage.canvas.width, stage.canvas.height);
    var squarePosition = (stage.canvas.width - squareDimensions) / 2;
    var square = new createjs.Shape();
    square.graphics.beginStroke("black");
    square.graphics.drawRect(squarePosition, 0, squareDimensions, squareDimensions);
    return square;
};  