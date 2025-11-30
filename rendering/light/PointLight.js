import { Light } from "./Light.js";

export class PointLight extends Light {
    position;

    constructor(lightColor, position, ambientIntensity, diffuseIntensity) {
        super(lightColor, ambientIntensity, diffuseIntensity);
        this.position = position;
    }
}
