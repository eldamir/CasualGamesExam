function LoadingScene(game) {
    this.game = game;
    this.preloadText = new createjs.Text("", "bold 30px Verdana", "white");
}

/**
 * GameBoardScene extends scene
 */
LoadingScene.__proto__ = Scene;

LoadingScene.prototype.addAssets = function(stage){
    console.log("Adding assets to Loading Scene");
    this.preloadText.text="LOADING... 0%";
    this.preloadText.regX = this.preloadText.getMeasuredWidth() / 2;
    this.preloadText.regY = this.preloadText.getMeasuredHeight() / 2;
    this.preloadText.x = stage.canvas.width / 2;
    this.preloadText.y = stage.canvas.height / 2;
    stage.addChild(this.preloadText);
};
