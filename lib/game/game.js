/**
 * Class used to hold a code and a pressed value
 * @param code Keycode
 */
function Key(code) {
    if (!code) {
        throw new Error("Code not defined");
    }
    this.code = code;
    this.pressed = false;
}

Key.prototype.setPressed = function(bool) {
    this.pressed = bool;
};


/**
 *
 * @param id The ID of the canvas to be used
 */
function Game(id) {
    this.stageId = id;
    this.preloader = new Preloader(this);
    this.settings = {
        media: [
            {id: "snake", src: "lib/media/sprites/snake.json"},
            {id: "mouse", src: "lib/media/sprites/mouse.json"}
        ],
        controls: {
            player1LeftKey: new Key(37), // Left
            player1RightKey: new Key(39), // Right
            player2LeftKey: new Key(65), // A
            player2RightKey: new Key(68) // D
        }
    };
    this.currentScene = undefined;
    this.gameOver = undefined;
    this.setCanvasDimensions();

    this.setupStage();
}

/**
 * Setting up stage and ticker for use on different scenes
 */
Game.prototype.setupStage = function () {
    this.stage = new createjs.Stage(this.stageId);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.onTick);
    this.preloader.loadQueue(this.settings.media);
};


/**
 * Resets game to default stage
 */
Game.prototype.init = function () {
    console.log("Initializing snake");

    this.setScene(new MainScene(this));

    window.onkeyup = this.keyUp();
    window.onkeydown = this.keyDown();

};

Game.prototype.keyDown = function () {
    var game = this; // This Game object
    return function (event) {
        for (var key in game.settings.controls) {
            if (game.settings.controls[key].code == event.keyCode) {
                game.settings.controls[key].setPressed(true);
            }
        }
    }
};

Game.prototype.keyUp = function () {
    var game = this; // This Game object
    return function (event) {
        for (var key in game.settings.controls) {
            // If key pressed is valid
            if (game.settings.controls[key].code == event.keyCode) {
                game.settings.controls[key].setPressed(false);
            }
        }
    }
};

Game.prototype.setCanvasDimensions = function () {
    console.log("Setting canvas dimensions");
    // Using jQuery to set properties
    $(this.stageId).prop("width", 800);
    $(this.stageId).prop("height", 600);
    $(this.stageId).css("background-color", "lightgrey");

};

Game.prototype.setScene = function (scene) {
    console.log("Setting scene");
    this.stage.removeAllChildren();
    this.currentScene = scene;
    scene.addAssets(this.stage);
};

Game.prototype.onTick = function (e) {
    //var game = this; // This Game object
   // return function () {
     //   if (game.currentScene.onTick != undefined) {
       //     game.currentScene.onTick();
        //}
    // TODO: animations only work when update get an event
    if (game.currentScene.onTick != undefined) {
        game.currentScene.onTick();
    }
    game.stage.update(e);

};