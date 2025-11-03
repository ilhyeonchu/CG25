export default `#version 300 es

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec2 a_texCoord;
layout(location = 2) in vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_projection;
uniform mat4 u_view;

out vec2 v_texCoord;
out vec3 v_normal;
out vec3 v_worldPosition;

void main() {
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);

  v_texCoord = a_texCoord;
  v_normal = mat3(transpose(inverse(u_model))) * a_normal;
  v_worldPosition = vec3(u_model * vec4(a_position, 1.0));
}
`;