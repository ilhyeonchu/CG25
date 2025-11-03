export class Light {
    lightColor;
    direction;
    ambientIntensity;
    diffuseIntensity;

    constructor(lightColor, direction, ambientIntensity, diffuseIntensity) {
        this.lightColor = lightColor;
        this.direction = direction;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
    }
}