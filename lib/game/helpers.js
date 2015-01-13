function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function toRadians(angle) {
    return angle / (180 / Math.PI);
}

function getRandomInt(min, max) {
    if (min === undefined)
        throw new Error("getRandomInt must have at least one parameter: max");
    // If one parameter is given, use it as max and default min to 0
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRotatedVector(vector, degrees) {
    var x = vector[0];
    var y = vector[1];
    var radians = toRadians(degrees);
    return [
        x * Math.cos(radians) - y * Math.sin(radians),
        x * Math.sin(radians) + y * Math.cos(radians)
    ]
}

function getRandomlyRotatedVector(vector) {
    var degrees = getRandomInt(0,360);
    return getRotatedVector(vector, degrees);
}

function hitTest(obj1, obj2) {
    if (obj1.radius && obj2.radius) {
        // Calculate the distance between the objects.
        a = Math.abs(obj1.geometry.x - obj2.geometry.x);
        b = Math.abs(obj1.geometry.y - obj2.geometry.y);
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));  // Pythagoras
        // Since they are round, they collide if distance is less than radius1 + radius2
        return c < obj1.radius + obj2.radius
    }
    return false;
}