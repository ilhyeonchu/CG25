export class Light {
    lightColor;
    ambientIntensity;
    diffuseIntensity;

    constructor(lightColor, ambientIntensity, diffuseIntensity) {
        this.lightColor = lightColor;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
    }
}