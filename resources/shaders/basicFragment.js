export default `#version 300 es

precision mediump float;

layout(location = 0) out vec4 outColor;

in vec2 v_texCoord;
in vec3 v_normal;

uniform sampler2D u_texture;

void main() {
  outColor = texture(u_texture, v_texCoord);
}
`