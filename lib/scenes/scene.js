/**
 * Abstract base class
 */
function Scene() {
    throw new Error("Scene is abstract");
}

Scene.prototype.addAssets = function (stage) {
    throw new Error("not implemented");
}