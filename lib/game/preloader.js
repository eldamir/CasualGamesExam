function Preloader(game){
    this.game = game;
    this.queue;
}

Preloader.prototype.loadQueue = function (manifest) {
    this.game.setScene(new LoadingScene());

    this.queue = new createjs.LoadQueue();
    this.queue.installPlugin(createjs.Sound);
    this.queue.on("progress", this.progress());
    this.queue.on("complete", this.game.init());
    this.queue.loadManifest(manifest);
}

Preloader.prototype.progress = function () {
    console.log("Reached progress function");
    var loadingScene = this;
    return function(e){
        loadingScene.loadProgress(e);
    }
}

Preloader.prototype.loadProgress = function(event) {
    var percent = Math.round(event.progress * 100);
    this.game.currentScene.preloadText = "LOADING... " + percent + "%";
}