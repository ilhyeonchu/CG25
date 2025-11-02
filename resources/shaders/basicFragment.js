export default `#version 300 es

precision mediump float;

struct Light {
    vec3 color;
    float ambientIntensity;
};

layout(location = 0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;

uniform sampler2D u_texture;
uniform Light u_light;

void main() {
    vec3 lightAmbient = u_light.color * u_light.ambientIntensity;
    outColor = texture(u_texture, v_texCoord) * vec4(lightAmbient, 1.0);
}
`