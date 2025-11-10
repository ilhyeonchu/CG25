export default `#version 300 es

precision mediump float;

layout(location = 0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;

uniform sampler2D u_depthmap;

void main() {
    float depthValue = texture(u_depthmap, v_texCoord).r;
    outColor = vec4(vec3(depthValue), 1.0);
}
`