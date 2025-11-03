export default `#version 300 es

precision mediump float;

struct Light {
    vec3 color;
    vec3 direction;
    float ambientIntensity;
    float diffuseIntensity;
};

layout(location = 0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;

uniform sampler2D u_texture;
uniform Light u_light;

void main() {
    // Ambient light term
    vec3 lightAmbient = u_light.color * u_light.ambientIntensity;

    // Diffuse light term
    float angle = dot(normalize(v_normal), normalize(u_light.direction));
    float diffuseFactor = max(angle, 0.0);
    vec3 lightDiffuse = u_light.color * u_light.diffuseIntensity * diffuseFactor;

    vec3 lightResult = lightAmbient + lightDiffuse;

    outColor = texture(u_texture, v_texCoord) * vec4(lightResult, 1.0);
}
`