export default `#version 300 es

precision mediump float;

layout(location = 0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;

void main() {
  outColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`