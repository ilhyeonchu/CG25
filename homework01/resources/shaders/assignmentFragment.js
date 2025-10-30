export default
`#version 300 es

precision mediump float;

layout(location = 0) out vec4 outColor;

in vec4 v_color;

void main() {
    outColor = v_color;
}
`