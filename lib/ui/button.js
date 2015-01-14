
function Button(options) {
    var image = options.image != undefined ? options.image : null;
    var preloader = options.preloader != undefined ? options.preloader : null;
    var spriteSheet = options.spriteSheet != undefined ? options.spriteSheet : null;
    var defaultSprite = options.defaultSprite != undefined ? options.defaultSprite : null;
    var scale = options.imageScale != undefined ? options.imageScale : 1;
    var text = options.text != undefined ? options.text : "";
    var fontSize = options.fontSize != undefined ? options.fontSize : 20;
    var x = options.x != undefined ? options.x : 0;
    var y = options.y != undefined ? options.y : 0;
    var width = options.width != undefined ? options.width : 100;
    var height = options.height != undefined ? options.height : 50;
    var center = options.center != undefined ? options.center : false;
    var onClick = options.onClick != undefined ? options.onClick : function (e) {
        console.log("onClick undefined");
    };

    // The top-level container to be added to the stage
    var topLevelContainer = new createjs.Container();

    if(image){
        var picture = new createjs.Bitmap(image);
        picture.scaleX = picture.scaleY = scale;
        topLevelContainer.addChild(picture);
    } else if (spriteSheet) {
        var sheet = new createjs.SpriteSheet(preloader.queue.getResult(spriteSheet));
        topLevelContainer.sprite = new createjs.Sprite(sheet, defaultSprite);
        topLevelContainer.sprite.scaleX = topLevelContainer.sprite.scaleY = scale;
        topLevelContainer.addChild(topLevelContainer.sprite);
    } else {
        // The background layout of the button
        var backgroundShape = new createjs.Shape();
        backgroundShape.graphics.beginFill("blue");
        backgroundShape.graphics.drawRoundRect(0, 0, width, height, 12);

        // The text on the button
        var textBox = new createjs.Text(text, fontSize + "px Arial", "black");
        textBox.textAlign = "center";
        textBox.x = width / 2;
        textBox.y = (height - fontSize) / 2;

        // Add children to top level container
        topLevelContainer.addChild(backgroundShape);
        topLevelContainer.addChild(textBox);
    }

    // Set position and size distribution
    topLevelContainer.x = x;
    topLevelContainer.y = y;
    topLevelContainer.width = width;
    topLevelContainer.height = height;

    if (center) {
        topLevelContainer.x -= (width / 2);
        topLevelContainer.y -= (height / 2);
    }

    topLevelContainer.on("click", onClick);

    return topLevelContainer;
}
