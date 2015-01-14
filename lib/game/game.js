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
    this.hud = {};
    this.settings = {
        media: [
            // Sounds
            {id: "munch0", src: "lib/media/sounds/munch1.wav"},
            {id: "munch1", src: "lib/media/sounds/munch2.mp3"},
            {id: "munch2", src: "lib/media/sounds/burp1.wav"},
            {id: "munch3", src: "lib/media/sounds/burp2.wav"},
            {id: "death", src: "lib/media/sounds/death.wav"},
            {id: "background", src: "lib/media/sounds/background.wav"},
            // Models
            {id: "snake", src: "lib/media/sprites/snake.json"},
            {id: "mouse", src: "lib/media/sprites/mouse.json"},
            // UI
            {id: "mute", src: "lib/media/sprites/mute.json"}
        ],
        controls: {
            player1LeftKey: new Key(37), // Left
            player1RightKey: new Key(39), // Right
            player2LeftKey: new Key(65), // A
            player2RightKey: new Key(68) // D
        }
    };
    this.currentScene = undefined;
    this.backgroundSound = undefined;

    this.setCanvasDimensions();

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
    this.playBackgroundSound();

    window.onkeyup = this.keyUp();
    window.onkeydown = this.keyDown();

    // Setting up mutebutton on game to be accesible globally
    var game = this;
    this.hud.muteButton = Button({
        spriteSheet: "mute",
        defaultSprite: "unmute",
        preloader: game.preloader,
        x: game.stage.canvas.width - 170,
        y: game.stage.canvas.height - 30,
        onClick: function (e){
            console.log("Mute button clicked");
            game.muteSound();
        }
    });

    this.setScene(new MainScene(this));
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
    $(this.stageId).prop("width", 1000);
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
    var game = this; // This Game object
   return function (e) {
       if (game.currentScene.onTick != undefined) {
           game.currentScene.onTick();
       }
       game.stage.update(e);
   }
};

Game.prototype.playBackgroundSound = function () {
    this.backgroundSound = new createjs.Sound.play("background", "none", 0, 0, -1);

}

Game.prototype.muteSound = function () {
    //console.log("reached mutesound method");
    if (this.backgroundSound.getVolume() == 0){
        this.backgroundSound.setVolume(1);
        this.hud.muteButton.sprite.gotoAndPlay("unmute");
    } else {
        this.backgroundSound.setVolume(0);
        this.hud.muteButton.sprite.gotoAndPlay("mute");
    }
}

