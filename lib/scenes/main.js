function MainScene() {

}

/**
 * MainScene extends Scene
 */
MainScene.__proto__ = Scene;

MainScene.prototype.addAssets = function(stage) {
    console.log("Adding assets for MainScene");
    var mainMenuText = new createjs.Text("Main Menu", "20px Arial", "black");
    mainMenuText.textAlign = "center";
    mainMenuText.x = stage.canvas.width / 2;
    mainMenuText.y = stage.canvas.height * 1/6;
    //mainMenuText.width = stage.canvas.width;
    //mainMenuText.height = stage.canvas.height * 1/6;
    stage.addChild(mainMenuText);
}