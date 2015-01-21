function GameBoardScene(game) {
    this.game = game;
    this.gameBoard = undefined;
    this.score = 0;
    this.rules = {
        boxedLevel: true,
        multiPlayer: false
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
    console.log("Rules", this.rules);
    this.gameBoard = this.createGameBoard(stage);
    console.log("Adding assets to Game Board");
    stage.addChild(this.gameBoard);

    this.setupBackground();

    this.setupScoreBox();
    
    // Adding mute button
    stage.addChild(this.game.hud.muteButton);

    this.player = new Snake({
        game: this.game,
        rules: this.rules,
        leftKey: this.game.settings.controls.player1LeftKey,
        rightKey: this.game.settings.controls.player1RightKey
    });
    stage.addChild(this.player.geometry);
    if (this.rules.multiPlayer) {
        this.player2 = new Snake({
            game: this.game,
            rules: this.rules,
            spriteSheet: "snake2",
            initialX: 500,
            initialY: 500,
            leftKey: this.game.settings.controls.player2LeftKey,
            rightKey: this.game.settings.controls.player2RightKey
        });
        stage.addChild(this.player.geometry);
    }

    // Add two starting mice
    this.addMouse();
    this.addMouse();
};

/**
 * This method is called for every tick.
 * This is where we move the actors around on the game board
 */
GameBoardScene.prototype.onTick = function () {
    var players = [this.player, this.player2];

    for (var i in players) {
        var player = players[i];
        if (!player)
            continue;

        // Move the player
        player.move();

        // Spawn the mouse for the snake to eat
        this.doMouseBehaviour();

        // Eat a mouse on collision
        for (var i = 0; i < this.mice.length; i++) {
            if (hitTest(player.body, this.mice[i])) {
                player.body.geometry.gotoAndPlay("bite");
                player.addPart();
                player.playEatSound();
                this.score++;
                this.setHighScore();
                this.updateScoreBox();
                this.game.stage.removeChild(this.mice[i].geometry);
                this.mice.splice(i, 1);
                i--;
            }
        }

        this.killIfPlayerOutOfBounds(player);
    }

    // If the snakes are no longer touching the third bodypart, make them mortal
    if (!this.player.mortal && !hitTest(this.player.body, this.player.body.next.next)) {
        this.player.mortal = true;
        console.log("player1 mortal");
    }
    if (this.rules.multiPlayer && !this.player2.mortal && !hitTest(this.player2.body, this.player2.body.next.next)) {
        this.player2.mortal = true;
        console.log("player2 mortal");
    }

    // Detect if the snake hits one of the players' bodies
    // Make a pointer to P1's tail
    var player1Tail = this.player.getLastPart();
    var player1Length = this.player.length();
    var player2Head = this.player2 ? this.player2.body : null;
    // Connect the tail to the head of P2, to make iteration easier
    if (this.rules.multiPlayer) {
        player1Tail.next = this.player2.body;
    }

    var part = this.player.body;
    while (part.next) {
        if (this.player.mortal
            && hitTest(this.player.body, part)
            && part != this.player.body            // Don't die if colliding with your own head
            && part != this.player.body.next       // Don't die if colliding with your neck
            && part != player2Head)
        {
            this.killPlayer(this.player)
        }
        if (this.rules.multiPlayer) {
            if (this.player2.mortal
                && hitTest(this.player2.body, part)
                && part != this.player2.body            // Don't die if colliding with your own head
                && part != this.player2.body.next       // Don't die if colliding with your neck
                && part != this.player.body)
            {
                this.killPlayer(this.player2)
            }
        }
        part = part.next;
    }

    // Set P1's tail back to point at nothing.
    player1Tail.next = null;
};

GameBoardScene.prototype.doMouseBehaviour = function () {
    // The chances of action. The numbers are interpreted as one in FOO, e.g. spawnChance = 300 -> 1/300
    // TODO: balance the movement of the mouse
    var spawnChance = 130;
    var moveChance = 8;
    var changeDirectionChance = 75;

    if(this.player.alive && (this.player2 == null || this.player2.alive)) {
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
    if (this.rules.multiPlayer)
        return;
    this.hud.score.text = "Score: " + this.score;
    this.hud.highScore.text = "High score: " + this.game.highScore;

};


GameBoardScene.prototype.setupScoreBox = function () {
    if (this.rules.multiPlayer)
        return;
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

GameBoardScene.prototype.killIfPlayerOutOfBounds = function (player) {
    if (player.body.geometry.x + player.radius > this.gameBoard.width + this.gameBoard.x ||
        player.body.geometry.x - player.radius < this.gameBoard.x ||
        player.body.geometry.y + player.radius > this.gameBoard.height ||
        player.body.geometry.y - player.radius < 0){
            this.killPlayer(player);
    }
};

GameBoardScene.prototype.killPlayer = function (player) {
    if(!player.alive)
        return;

    // Kill both players
    this.player.alive = false;
    if (this.rules.multiPlayer)
        this.player2.alive = false;

    player.body.geometry.gotoAndPlay("dead");

    var text;
    if (this.rules.multiPlayer) {
        if (player == this.player) {
            text = "Player 2 wins!"
        } else if (player == this.player2) {
            text = "Player 1 wins!"
        } else {
            text = "It's a draw!"
        }
    } else {
        text = "Game Over"
    }

    var gameOverText = new createjs.Text(text, "bold 60px Arial", "blue");
    gameOverText.textAlign = "center";
    var bounds = this.getBounds();
    
    if(!this.game.muted)
        new createjs.Sound.play("death");

    gameOverText.x = bounds[0] + (bounds[1] - bounds[0]) / 2;
    gameOverText.y = bounds[2] + (bounds[3] - bounds[2]) / 2 - 30; // 30 is half the font size
    this.game.stage.addChild(gameOverText);

    var scene = this;
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
                var newGame = new GameBoardScene(game);
                newGame.rules = scene.rules;
                game.setScene(newGame);
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


