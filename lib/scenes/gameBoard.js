function GameBoardScene(game) {
    this.game = game;
    this.gameBoard = undefined;
    this.score = 0;
    this.rules = {
        boxedLevel: true
    };
    this.hud = {};
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

    this.setupBackground();
    this.setupScoreBox();
    
    // Adding mute button
    stage.addChild(this.game.hud.muteButton);

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
    // Move the player
    this.player.move();

    // Spawn the mouse for the snake to eat
    this.doMouseBehaviour();

    // Eat a mouse on collision
    for (var i = 0; i < this.mice.length; i++) {
        if (hitTest(this.player.body, this.mice[i])) {
            this.player.body.geometry.gotoAndPlay("bite");
            this.player.addPart();
            this.player.playEatSound();
            this.score++;
            this.setHighScore();
            this.updateScoreBox();
            this.game.stage.removeChild(this.mice[i].geometry);
            this.mice.splice(i, 1);
            i--;
        }
    }

    // Detect if the snake hits its own body.
    // Start with the third body part. Not the head, nor the neck, but the next.
    var part = this.player.body.next.next;
    while (part.next) {
        if (hitTest(this.player.body, part)
            && this.player.length() > this.player.initialBodyPartCount) {
            this.killPlayer();
        }
        part = part.next;
    }
    this.killIfPlayerOutOfBounds();
};

GameBoardScene.prototype.doMouseBehaviour = function () {
    // The chances of action. The numbers are interpreted as one in FOO, e.g. spawnChance = 300 -> 1/300
    // TODO: balance the movement of the mouse
    var spawnChance = 130;
    var moveChance = 8;
    var changeDirectionChance = 75;

    if(this.player.alive) {
        if (getRandomInt(spawnChance) == 0) {
            this.addMouse();
        }
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

GameBoardScene.prototype.updateScoreBox = function () {
    this.hud.score.text = "Score: " + this.score;
    this.hud.highScore.text = "High score: " + this.game.highScore;

};


GameBoardScene.prototype.setupScoreBox = function () {
    var padding = 12;
    var score = new createjs.Text("Score", "20px Arial", "black");
    score.x = this.getBounds()[1] + padding;
    score.y = padding + 25; // Padding + text size and a little extra to make room for high score
    this.hud.score = score;
    this.game.stage.addChild(score);

    var highScore = new createjs.Text("High score", "20px Arial", "black");
    highScore.x = this.getBounds()[1] + padding;
    highScore.y = padding;
    this.hud.highScore = highScore;
    this.game.stage.addChild(highScore);

    this.updateScoreBox();
};

GameBoardScene.prototype.setupBackground = function () {
    var sheet = new createjs.SpriteSheet(this.game.preloader.queue.getResult("background_tiles"));
    var bounds = this.getBounds();
    var width = Math.ceil((bounds[1] - bounds[0]) / 40);
    var height = Math.ceil((bounds[3] - bounds[2]) / 40);

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var tile_num = getRandomInt(8);
            var sprite = new createjs.Sprite(sheet, "tile" + tile_num);
            sprite.x = j * 40 + bounds[0];
            sprite.y = i * 40;
            this.game.stage.addChild(sprite);
        }
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
    return [this.gameBoard.x, this.gameBoard.width + this.gameBoard.x,
        this.gameBoard.y, this.gameBoard.height + this.gameBoard.y]
};

GameBoardScene.prototype.killIfPlayerOutOfBounds = function () {
    if (this.player.body.geometry.x + this.player.radius > this.gameBoard.width + this.gameBoard.x ||
        this.player.body.geometry.x - this.player.radius < this.gameBoard.x ||
        this.player.body.geometry.y + this.player.radius > this.gameBoard.height ||
        this.player.body.geometry.y - this.player.radius < 0){
            this.killPlayer();
    }
}

GameBoardScene.prototype.killPlayer = function () {
    if(!this.player.alive)
        return;

    this.setHighScore();
    //console.log("Highscore:", this.game.highScore);

    this.player.alive = false;
    this.player.body.geometry.gotoAndPlay("dead");

    var gameOverText = new createjs.Text("Game Over", "bold 60px Arial", "blue");
    gameOverText.textAlign = "center";
    var bounds = this.getBounds();
    new createjs.Sound.play("death");
    gameOverText.x = bounds[0] + (bounds[1] - bounds[0]) / 2;
    gameOverText.y = bounds[2] + (bounds[3] - bounds[2]) / 2 - 30; // 30 is half the font size
    this.game.stage.addChild(gameOverText);

    this.game.stage.addChild(
        Button({
            text: "Try again",
            x: bounds[0] + (bounds[1] - bounds[0]) / 2,
            y: bounds[2] + (bounds[3] - bounds[2]) / 4,
            width: 180,
            height: 40,
            center: true,
            onClick: function (e) {
                console.log("Try again button clicked");
                game.setScene(new GameBoardScene(game));
            }
        }),
        Button({
            text: "Main menu",
            x: bounds[0] + (bounds[1] - bounds[0]) / 2,
            y: bounds[2] + (bounds[3] - bounds[2]) / 4 + 60,
            width: 180,
            height: 40,
            center: true,
            onClick: function (e) {
                console.log("main menu button clicked");
                game.setScene(new MainScene(game));
            }
        })
    );
};

GameBoardScene.prototype.setHighScore = function () {
    if (this.game.highScore < this.score){
        this.game.highScore = this.score;
    }
};


