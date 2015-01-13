function MainScene(game) {
    this.game = game;
}

/**
 * MainScene extends Scene
 */
MainScene.__proto__ = Scene;

MainScene.prototype.addAssets = function(stage) {
    console.log("Adding assets for MainScene");
    // Define layout helpers
    var rows = 6;
    function center() {
        return stage.canvas.width / 2
    }
    function row(rowNumber) {
        return stage.canvas.height * rowNumber / rows;
    }

    var mainMenuText = new createjs.Text("Main Menu", "20px Arial", "black");
    mainMenuText.textAlign = "center";
    mainMenuText.x = center();
    mainMenuText.y = row(1);
    //mainMenuText.width = stage.canvas.width;
    //mainMenuText.height = stage.canvas.height * 1/6;
    var game = this.game;


    stage.addChild(mainMenuText);
    stage.addChild(
        Button({
            text: "Single Player",
            x: center(),
            y: row(2),
            width: 180,
            height: 40,
            center: true,
            onClick: function (e) {
                console.log("Singleplayer button clicked");
                game.setScene(new GameBoardScene(game));
            }
        })
    );
    stage.addChild(
        Button({
            text: "Multiplayer - Local",
            x: center(),
            y: row(3),
            width: 180,
            height: 40,
            center: true,
            onClick: function (e) {
                console.log("Local button clicked");
                var gameBoardScene = new GameBoardScene(game);
                // TODO: Add the second player somehow
                game.setScene(new GameBoardScene(game));
            }
        })
    );
    stage.addChild(
        Button({
            text: "Multiplayer - Inet",
            x: center(),
            y: row(4),
            width: 180,
            height: 40,
            center: true,
            onClick: function (e) {
                console.log("Internet button clicked");
            }
        })
    );
};