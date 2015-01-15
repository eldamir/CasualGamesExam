/**
 * Created by ruben on 1/15/15.
 */


function NotImplementedScene(game) {
    this.game = game;
}

/**
 * MainScene extends Scene
 */
NotImplementedScene.__proto__ = Scene;

NotImplementedScene.prototype.addAssets = function (stage) {
    var rows = 3;
    function center() {
        return stage.canvas.width / 2
    }
    function row(rowNumber) {
        return stage.canvas.height * rowNumber / rows;
    }

    var text = new createjs.Text("This feature has not been implemented yet!", "22px Arial", "black");
    text.textAlign = "center";
    text.x = center();
    text.y = row(1);
    stage.addChild(text);

    var game = this.game;
    stage.addChild(
        Button({
            text: "Back to main menu",
            x: center(),
            y: row(2),
            width: 240,
            height: 40,
            center: true,
            onClick: function (e) {
                game.setScene(new MainScene(game));
            }
        })
    );
};