import { Depthmap } from "../core/Depthmap.js";

export class Light {
    gl;

    lightColor;
    ambientIntensity;
    diffuseIntensity;

    depthmap;
    depthmapWidth;
    depthmapHeight;

    constructor(gl, lightColor, ambientIntensity, diffuseIntensity, depthmapWidth, depthmapHeight) {
        this.gl = gl;

        this.lightColor = lightColor;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;

        this.depthmapWidth = depthmapWidth;
        this.depthmapHeight = depthmapHeight;
        this.depthmap = new Depthmap(gl, depthmapWidth, depthmapHeight);
    }
}