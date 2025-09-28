export default
    `#version 300 es
  layout(location=0) in vec4 a_position;
  layout(location=1) in vec4 a_color;
  
  uniform vec4 u_offset;
  out vec4 v_color;
  
  void main() {
    gl_Position = a_position + u_offset;
    v_color = a_color;
  }
`;