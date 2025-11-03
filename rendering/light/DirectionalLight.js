import { Light } from "./Light.js";

export class DirectionalLight extends Light {
    direction;

    constructor(lightColor, direction, ambientIntensity, diffuseIntensity) {
        super(lightColor, ambientIntensity, diffuseIntensity);
        this.direction = direction;
    }
}