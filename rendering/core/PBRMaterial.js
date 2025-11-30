export class PBRMaterial {
    albedo;
    metallic;
    roughness;
    ao;

    constructor(albedo = [1.0, 1.0, 1.0], metallic = 0.5, roughness = 0.5, ao = 1.0) {
        this.albedo = albedo;
        this.metallic = metallic;
        this.roughness = roughness;
        this.ao = ao;
    }
}