import { Light } from "./Light.js";

const {mat4, vec3 } = glMatrix;

export class DirectionalLight extends Light {
    direction;

    lightProjectionMatrix;
    lightViewMatrix;
    farPlane;

    constructor(gl, lightColor, direction, ambientIntensity, diffuseIntensity, depthmapWidth, depthmapHeight) {
        super(gl, lightColor, ambientIntensity, diffuseIntensity, depthmapWidth, depthmapHeight);
        this.direction = direction;
        this.farPlane = 10.0;
    }

    CalculateLightTransformMatrix() {
        this.lightProjectionMatrix = mat4.create();
        mat4.ortho(this.lightProjectionMatrix, -2.0, 2.0, -2.0, 2.0, 0.01, this.farPlane);

        let negativeDirection = vec3.create();
        vec3.scale(negativeDirection, this.direction, -1.0);
        this.lightViewMatrix = mat4.create();
        mat4.lookAt(this.lightViewMatrix, negativeDirection, [0, 0, 0], [0, 1, 0]);

        let vpMatrix = mat4.create();
        mat4.multiply(vpMatrix, this.lightProjectionMatrix, this.lightViewMatrix);

        return vpMatrix;
    }
}