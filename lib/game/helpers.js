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