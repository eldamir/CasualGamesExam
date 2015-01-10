
function Snake(options) {
    if (!options.game)
        throw new Error("Snake must have the game provided");
    if (!options.rules)
        throw new Error("Snake must have the rules provided");
    this.game = options.game;
    this.rules = options.rules;
    this.scale = .5;
    this.alive = true;
    this.radius = 20 * this.scale;
    this.rotationSpeed = 3.0;
    this.distanceBetweenBodyParts = this.radius * 1.7;
    this.velocity = options.velocity ? options.velocity : 2;

    this.direction = [0, -1];
    this.body = null;
    this.moves = [];
    this.moveOffset = this.distanceBetweenBodyParts / this.velocity;

    this.snakeSheet = new createjs.SpriteSheet(this.game.preloader.queue.getResult("snake"));

    // Create snake body parts
    var bodyParts = 5;
    for (var i = 0; i < bodyParts; i++) {
        this.addPart()
    }
    var part = this.body;
    while (part.next != null) {
        part = part.next;
    }
}

Snake.prototype.getLastPart = function () {
    if (this.body == null)
        return null;
    var part = this.body;
    while (part.next != null)
        part = part.next;
    return part;
};

/**
 * Adds a bodypart to the snake.
 * This method will resolve what kind of bodypart to add: head, body, or tail.
 * The method also makes sure that every part of the snake knows how to move
 */
Snake.prototype.addPart = function () {
    var parent = this.getLastPart();
    var geometry = this.getGeometryForNewPart();
    var position = this.getNewPosition(parent);
    geometry.x = position[0];
    geometry.y = position[1];
    geometry.scaleX = geometry.scaleY = this.scale;
    var part = {
        geometry: geometry,
        next: null,
        previous: parent
    };
    if (parent == null) {
        this.body = part;
    } else {
        parent.next = part;
    }
    this.game.stage.addChild(part.geometry);
};

/**
 * Gets the proper sprite for a new part of the snake
 */
Snake.prototype.getGeometryForNewPart = function () {
    var parent = this.getLastPart();
    if (parent == null) {
        return new createjs.Sprite(this.snakeSheet, "head");
    } else {
        return new createjs.Sprite(this.snakeSheet, "body");
    }
};

/**
 * Get the position in which to add a new part
 */
Snake.prototype.getNewPosition = function (parent) {
    if (parent == null) {
        var bounds = this.game.currentScene.getBounds();
        return [
            bounds[0] + ((bounds[1] - bounds[0]) / 2),
            bounds[2] + ((bounds[3] - bounds[2]) / 2)
        ];
    }
    return [
        parent.geometry.x,
        parent.geometry.y
    ];
};

Snake.prototype.move = function () {
    if (!this.alive)
        return;
    var newMove = [
        this.direction[0] * this.velocity,
        this.direction[1] * this.velocity
    ];

    // Insert the new move into the moves list
    this.moves.splice(0, 0, newMove);

    // Move all parts
    var part = this.body;
    var offset = 0;
    do {
        if (offset < this.moves.length) {
            // If there are enough moves; move!
            part.geometry.x += this.moves[offset][0];
            part.geometry.y += this.moves[offset][1];
        }
        part = part.next;
        offset = Math.floor(offset + this.moveOffset);
    } while (part != null);

    // TODO: If there are too many rules, truncate the list

    this.applyBoxRules();
};

Snake.prototype.applyBoxRules = function () {
    if (this.rules.boxedLevel) {
        if (this.body.geometry.x + this.radius > this.game.currentScene.gameBoard.width + this.game.currentScene.gameBoard.x ||
            this.body.geometry.x - this.radius < this.game.currentScene.gameBoard.x ||
            this.body.geometry.y + this.radius > this.game.currentScene.gameBoard.height ||
            this.body.geometry.y - this.radius < 0)
            this.alive = false;  // TODO: Kill the player
    } else {
        if (this.body.geometry.x > this.game.currentScene.gameBoard.width)
            this.body.geometry.x = 0;
        if (this.body.geometry.x < 0)
            this.body.geometry.x = this.game.currentScene.gameBoard.width;
        if (this.body.geometry.y > this.game.currentScene.gameBoard.height)
            this.body.geometry.y = 0;
        if (this.body.geometry.y < 0)
            this.body.geometry.y = this.game.currentScene.gameBoard.height;
    }
};

Snake.prototype.rotate = function (direction) {
    if(!this.alive)
        return;
    // Changing orientation 3 degrees per tick
    var degrees = this.rotationSpeed;
    if (direction == "left"){
        // Decrease rotation direction for left press
        degrees *= -1;
    }
    // Rotation visible geometry
    this.body.geometry.rotation += degrees;
    this.direction = getRotatedVector(this.direction, degrees);
};

Snake.prototype.collidesWith = function (other) {

};