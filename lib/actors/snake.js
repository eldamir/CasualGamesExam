
function Snake(options) {
    if (!options.game)
        throw new Error("Snake must have the game provided");
    if (!options.rules)
        throw new Error("Snake must have the rules provided");
    if (!options.leftKey)
        throw new Error("Snake must have a leftKey provided");
    if (!options.rightKey)
        throw new Error("Snake must have a rightKey provided");
    this.leftKey = options.leftKey;
    this.rightKey = options.rightKey;
    this.game = options.game;
    this.rules = options.rules;
    this.spriteSheet = options.spriteSheet != undefined ? options.spriteSheet : "snake";
    var bounds = this.game.currentScene.getBounds();
    this.initialX = options.initialX ? options.initialX : bounds[0] + ((bounds[1] - bounds[0]) / 2)
    this.initialY = options.initialY ? options.initialY : bounds[2] + ((bounds[3] - bounds[2]) / 2)

    this.scale = .5;
    this.alive = true;
    this.radius = 20 * this.scale;
    this.rotationSpeed = 5.0;

    // The amount of pixels desired between the body parts: slightly less than the full diameter
    this.distanceBetweenBodyParts = this.radius * 1.8;

    // The pixels moved per tick
    this.velocity = options.velocity ? options.velocity : 3;

    // The direction for the snake to move. Assuming the two values to be the catheters, the hypotenuse must always
    // be exactly 1, in order to not affect the velocity.
    this.direction = [0, -1];

    // The head of the snake. 'head.next' points to the next body part, and the body parts also link to the next part
    this.body = null;

    // A list of moves. Needs to be saved so the body parts know what to do
    this.moves = [];

    // The head uses this.moves[0]. The body parts need an offset to now which move to use,
    // e.g. part 2 would use this.moves[this.moveOffset] and part 3 would use this.moves[2 * this.moveOffset], etc.
    this.moveOffset = this.distanceBetweenBodyParts / this.velocity;

    // The sprite sheet used to animate the snake
    this.snakeSheet = new createjs.SpriteSheet(this.game.preloader.queue.getResult(this.spriteSheet));

    // The amount of body parts for a new snake
    this.initialBodyPartCount = 5;

    this.initializeSnake();
}

/**
 * Creates a new snake according to the settings and adds it to the stage
 */
Snake.prototype.initializeSnake = function () {
    for (var i = 0; i < this.initialBodyPartCount; i++) {
        this.addPart()
    }
};

/**
 * Follows the chain of body parts and returns the last one
 */
Snake.prototype.getLastPart = function () {
    if (this.body == null)
        return null;
    var part = this.body;
    while (part.next != null)
        part = part.next;
    return part;
};

/**
 * Adds a body part to the snake.
 * This method will resolve what kind of body part to add: head, body, or tail.
 * The method also makes sure that every part of the snake knows how to move
 */
Snake.prototype.addPart = function () {
    var parent = this.getLastPart();
    var geometry = this.getGeometryForNewPart();
    var position = this.getNewPosition(parent);
    geometry.x = position[0];
    geometry.y = position[1];
    geometry.scaleX = geometry.scaleY = this.scale;
    if (parent) {
        geometry.rotation = parent.geometry.rotation;
    }
    var part = {
        geometry: geometry,
        next: null,
        previous: parent,
        radius: this.radius
    };
    if (parent == null) {
        this.body = part;
    } else {
        parent.next = part;
    }
    this.game.stage.addChild(part.geometry);
    if (parent && parent != this.body) {
        parent.geometry.gotoAndPlay("body");
    }
};

/**
 * Gets the proper sprite for a new part of the snake
 */
Snake.prototype.getGeometryForNewPart = function () {
    var parent = this.getLastPart();
    if (parent == null) {
        return new createjs.Sprite(this.snakeSheet, "head");
    } else {
        return new createjs.Sprite(this.snakeSheet, "tail");
    }
};

/**
 * Get the position in which to add a new part
 */
Snake.prototype.getNewPosition = function (parent) {
    if (parent == null) {
        return [
            this.initialX,
            this.initialY
        ];
    }
    return [
        parent.geometry.x,
        parent.geometry.y
    ];
};

/**
 * Moves all parts of the snake
 */
Snake.prototype.move = function () {
    if (!this.alive)
        return;

    // Get the rotation
    var rotation = this.getRotation();
    // Rotate the snakes direction
    this.direction = getRotatedVector(this.direction, rotation);
    // Get the new move
    var newMove = [
        this.direction[0] * this.velocity,
        this.direction[1] * this.velocity
    ];
    // Add the rotation to the movement vector, so geometry knows to rotate as well
    newMove.push(rotation);

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
            part.geometry.rotation += this.moves[offset][2];
        }
        part = part.next;
        offset = Math.floor(offset + this.moveOffset);
    } while (part != null);

    // If there are too many saved moves, truncate the list
    // TODO: Make sure this is correct
    //var maximumMovesNeeded = this.moveOffset * this.moves.length - 1;
    //if (maximumMovesNeeded > this.moves.length) {
    //    this.moves.splice(maximumMovesNeeded, this.moves.length - maximumMovesNeeded)
    //}
    this.moves.splice(offset - this.moveOffset);

    this.applyBoxRules();
};

Snake.prototype.length = function () {
    var part = this.body;
    var count = 1;
    while (part.next) {
        count++;
        part = part.next;
    }
    return count;
};

Snake.prototype.playEatSound = function () {
    var i = getRandomInt(0, 3);
    new createjs.Sound.play("munch" + i);
}

/**
 * Applies the rules for boxedLevel
 */
Snake.prototype.applyBoxRules = function () {
    if (!this.rules.boxedLevel) {
        // TODO: This breaks movement. Make the move method do it instead.
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

/**
 * Returns the amount of degrees that the snake should rotate:
 * this.rotationSpeed, -1 * this.rotationSpeed, or 0
 */
Snake.prototype.getRotation = function () {
    var degrees = 0;
    if(!this.alive)
        return degrees;
    if (this.leftKey.pressed){
        degrees -= this.rotationSpeed;
    } else if (this.rightKey.pressed) {
        degrees += this.rotationSpeed;
    }
    return degrees;
};

