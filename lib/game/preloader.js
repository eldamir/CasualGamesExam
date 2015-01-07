function Preloader(game){
    this.game = game;
    this.queue = new createjs.LoadQueue();
}

Preloader.prototype.loadQueue = function (manifest) {
    var game = this.game;
    this.game.setScene(new LoadingScene());

    this.queue.installPlugin(createjs.Sound);
    this.queue.on("progress", this.progress());
    this.queue.on("complete", function () {
        game.init();
    });
    this.queue.loadManifest(manifest);
};

Preloader.prototype.progress = function () {
    console.log("Reached progress function");
    var loadingScene = this;
    return function(event){
        var percent = Math.round(event.progress * 100);
        console.log("Loading...", percent);
        loadingScene.game.currentScene.preloadText.text = "LOADING... " + percent + "%";
    }
};
