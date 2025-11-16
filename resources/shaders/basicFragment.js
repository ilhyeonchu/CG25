export default `#version 300 es

precision mediump float;

struct Light {
    vec3 color;
    float ambientIntensity;
    float diffuseIntensity;
};

struct DirectionalLight {
    Light base;
    vec3 direction;
};

struct Material {
    float specularIntensity;
    float shininess;
};

layout(location = 0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;
in vec3 v_worldPosition;
in vec4 v_lightSpacePosition;

uniform sampler2D u_texture;
uniform DirectionalLight u_directionalLight;
uniform vec3 u_eyePosition;
uniform Material u_material;
uniform sampler2D u_depthmap;

float CalculateShadow(vec4 lightSpacePosition) {
    vec3 projCoords = lightSpacePosition.xyz / lightSpacePosition.w;
    projCoords = projCoords * 0.5 + 0.5;
    float z = texture(u_depthmap, projCoords.xy).r;
    float d = projCoords.z;

    float shadowFactor = z < d ? 1.0 : 0.0;

    return shadowFactor;
}

vec3 CalculateLight(Light light, vec3 direction, vec3 normal, float shadowFactor) {
    // Ambient light term
    vec3 lightAmbient = light.color * light.ambientIntensity;

    // Diffuse light term
    float angle = dot(normal, direction);
    float diffuseFactor = max(angle, 0.0);
    vec3 lightDiffuse = light.color * light.diffuseIntensity * diffuseFactor;

    // Specular light term (r, v)
    vec3 vVec = normalize(u_eyePosition - v_worldPosition);
    vec3 rVec = 2.0 * dot(normal, direction) * normal - direction;
    float rvAngle = max(dot(rVec, vVec), 0.0);
    float specularFactor = pow(rvAngle, u_material.shininess);
    vec3 lightSpecular = light.color * u_material.specularIntensity * specularFactor;

    vec3 lightResult = lightAmbient + (1.0 - shadowFactor) * (lightDiffuse + lightSpecular);
    return lightResult;
}

vec3 CalculateDirectionalLight(DirectionalLight directionalLight, vec3 normal) {
    vec3 lightDirection = normalize(directionalLight.direction);
    float shadowFactor = CalculateShadow(v_lightSpacePosition);
    vec3 lightResult = CalculateLight(directionalLight.base, lightDirection, normal, shadowFactor);

    return lightResult;
}

void main() {
    vec3 normal = normalize(v_normal);
    vec3 lightResult = CalculateDirectionalLight(u_directionalLight, normal);

    outColor = texture(u_texture, v_texCoord) * vec4(lightResult, 1.0);
}
`