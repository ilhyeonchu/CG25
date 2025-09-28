export default
    `#version 300 es
  layout(location=0) in vec4 a_position;
  
  uniform vec4 u_offset;

  void main() {
    gl_Position = a_position + u_offset;
  }
`;