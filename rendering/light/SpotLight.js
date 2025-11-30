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

    // camera의 위치와 방향 정보를 가져와 업데이트
    Update(px, py, pz, dx, dy, dz) {
        this.position[0] = px;
        this.position[1] = py;
        this.position[2] = pz;
        this.direction[0] = dx;
        this.direction[1] = dy;
        this.direction[2] = dz;
    }
}
