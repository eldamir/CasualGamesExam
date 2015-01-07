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


/**
 *
 * @param id The ID of the canvas to be used
 */
function Game(id) {
    this.stageId = id;
    this.preloader = new Preloader(this);
    this.settings = {
        media: [
            {id: "testSong", src: "lib/media/sounds/testSong.m4a"}
        ]
    };
    this.currentScene = undefined;
    this.gameOver = undefined;
    this.setCanvasDimensions();
    this.controls = {
        player1LeftKey: new Key(37), // Left
        player1RightKey: new Key(39), // Right
        player2LeftKey: new Key(65), // A
        player2RightKey: new Key(68) // D
    };

    this.setupStage();
}

/**
 * Setting up stage and ticker for use on different scenes
 */
Game.prototype.setupStage = function () {
    this.stage = new createjs.Stage(this.stageId);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.onTick());
    this.preloader.loadQueue(this.settings.media);
};


/**
 * Resets game to default stage
 */
Game.prototype.init = function () {
    console.log("Initializing snake");

    this.setScene(new MainScene());

    window.onkeyup = this.keyUp();
    window.onkeydown = this.keyDown();

    //this.addCircle();
};


Game.prototype.addCircle = function () {
    console.log("Adding circle");
    var circle = new createjs.Bitmap("../media/images/circle.png");
    circle.x = 100;
    circle.y = 100;
    this.stage.addChild(circle);
};

Game.prototype.keyUp = function () {
    var game = this; // This Game object
    return function (event) {
        for (var key in game.controls) {
            // If key pressed is valid
            if (game.controls[key].code == event.keyCode) {
                game.controls[key].pressed = true;
            }
        }
    }
};

Game.prototype.keyDown = function () {
    var game = this; // This Game object
    return function (event) {
        for (var key in game.controls) {
            if (game.controls[key].code == event.keyCode) {
                game.controls[key].pressed = false;
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

Game.prototype.onTick = function () {
    var game = this; // This Game object
    return function () {
        game.stage.update();
    }
};