export default `#version 300 es

precision mediump float;

struct Light {
    vec3 color;
    float ambientIntensity;
    float diffuseIntensity;
};

// struct DirectionalLight {
//     Light base;
//     vec3 direction;
// };

struct PointLight {
    Light base;
    vec3 position;
};

struct SpotLight {
    Light base;
    vec3 position;
    vec3 direction;
    float cutoff;
};

struct Material {
    float specularIntensity;
    float shininess;
};

layout(location = 0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;
in vec3 v_worldPosition;

uniform sampler2D u_texture;
// uniform DirectionalLight u_directionalLight;
uniform PointLight u_pointLight;
uniform SpotLight u_spotLight;
uniform vec3 u_eyePosition;
uniform Material u_material;

vec3 CalculateLight(Light light, vec3 direction, vec3 normal) {
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

    vec3 lightResult = lightAmbient + lightDiffuse + lightSpecular;
    return lightResult;
}

// vec3 CalculateDirectionalLight(DirectionalLight directionalLight, vec3 normal) {
//     vec3 lightDirection = normalize(directionalLight.direction);
//     vec3 lightResult = CalculateLight(directionalLight.base, lightDirection, normal);
//
//     return lightResult;
// }

vec3 CalculatePointLight(PointLight pointLight, vec3 normal) {
    vec3 lightDirection = normalize(pointLight.position - v_worldPosition);
    vec3 lightResult = CalculateLight(pointLight.base, lightDirection, normal);
    float distance = length(pointLight.position - v_worldPosition);
    float attenuation = 1.0 / (distance * distance + 0.01);
    return lightResult * attenuation;
}

vec3 CalculateSpotLight(SpotLight spotLight, vec3 normal) {
    vec3 toLight = normalize(spotLight.position - v_worldPosition);      // fragment -> light
    vec3 toFragment = normalize(v_worldPosition - spotLight.position);   // light -> fragment (for cutoff)
    float theta = dot(toFragment, normalize(spotLight.direction));
    float cutoff = cos(radians(spotLight.cutoff));

    if (theta > cutoff) {
        return CalculateLight(spotLight.base, toLight, normal);
    }

    return vec3(0.0);
}

void main() {
    vec3 normal = normalize(v_normal);
    vec3 lightResult = vec3(0.0);
    lightResult += CalculatePointLight(u_pointLight, normal);
    lightResult += CalculateSpotLight(u_spotLight, normal);

    outColor = texture(u_texture, v_texCoord) * vec4(lightResult, 1.0);
}
`
