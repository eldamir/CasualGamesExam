/**
 *
 * @param id The ID of the canvas to be used
 */
function Game (id) {
    this.stageId = id;
    this.stage;
    this.preloader;
    this.currentScene;
    this.gameOver;
    this.setCanvasDimensions();

}

/**
 * Resets game to default stage
 */
Game.prototype.init = function() {
    console.log("Initializing snake");
    this.stage = new createjs.Stage(this.stageId);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.onTick());
    this.setScene(new MainScene());

};

Game.prototype.setCanvasDimensions = function() {
    console.log("Setting canvas dimensions");
    // Using jQuery to set properties
    $(this.stageId).prop("width", 800);
    $(this.stageId).prop("height", 600);
    $(this.stageId).css("background-color", "lightgrey");


};

Game.prototype.setScene = function(scene) {
    console.log("Setting scene");
    this.stage.removeAllChildren();
    scene.addAssets(this.stage);
};

Game.prototype.onTick = function() {
    var game = this; // This Game object
    return function () {
        game.stage.update();
    }
};