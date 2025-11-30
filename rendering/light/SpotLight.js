import { Light } from "./Light.js";

export class SpotLight extends Light {
    position;
    direction;
    cutoff;

    constructor(lightColor, position, direction, cutoff, ambientIntensity, diffuseIntensity) {
        super(lightColor, ambientIntensity, diffuseIntensity);
        this.position = position;
        this.direction = direction;
        this.cutoff = cutoff;
    }
}
