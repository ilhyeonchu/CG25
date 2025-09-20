"use strict";

import { VertexBuffer } from './rendering/core/VertexBuffer.js';
import { IndexBuffer } from './rendering/core/IndexBuffer.js';

var vertexShaderSource = `#version 300 es
  layout(location=0) in vec4 a_position;
  
  uniform vec4 u_offset;
  void main() {
    gl_Position = a_position + u_offset;
  }
`;

var fragmentShaderSource = `#version 300 es
  precision mediump float;
  layout(location=0) out vec4 outColor;

  uniform vec4 u_color;

  void main() {
    outColor = u_color;
  }
`;

var triangleVertexShaderSource = `#version 300 es
  layout(location=0) in vec4 a_position;
  
  uniform vec4 u_offset;
  void main() {
    gl_Position = a_position + u_offset;
  }
`;

var triangleFragmentShaderSource = `#version 300 es
  precision mediump float;
  layout(location=0) out vec4 outColor;

  void main() {
    outColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
`;

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Rectangle
  var positions = [
    -0.5, -0.5,
    0.5, -0.5,
    0.5, 0.5,
    -0.5, 0.5,
  ];

  var indices = [
    0, 1, 2,
    0, 2, 3,
  ];

  // Triangle
  var trianglePositions = [
    1.0, 0.0,
    0.0, 0.0,
    1.0, -1.0,
  ];

  var triangleIndices = [
    0, 1, 2,
  ];

  // Rectangle Buffer
  var rectangleVAO = gl.createVertexArray();
  gl.bindVertexArray(rectangleVAO);

  let rectangleVB = new VertexBuffer(gl, positions);
  let rectangleIB = new IndexBuffer(gl, indices, 6);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

  gl.bindVertexArray(null);
  rectangleVB.unbind(gl);
  rectangleIB.unbind(gl);

  // Triangle Buffer
  var triangleVAO = gl.createVertexArray();
  gl.bindVertexArray(triangleVAO);

  let triangleVB = new VertexBuffer(gl, trianglePositions);
  let triangleIB = new IndexBuffer(gl, triangleIndices, 3);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

  gl.bindVertexArray(null);
  triangleVB.unbind(gl);
  triangleIB.unbind(gl);


  // Rectangle Program
  var program = webglUtils.createProgramFromSources(gl,
    [vertexShaderSource, fragmentShaderSource]);

  gl.useProgram(program);
  gl.useProgram(null);


  // Triangle Program
  var triangleProgram = webglUtils.createProgramFromSources(gl,
    [triangleVertexShaderSource, triangleFragmentShaderSource]);

  gl.useProgram(triangleProgram);
  gl.useProgram(null);

  var x_offset = 0.0;
  const slider = document.getElementById("xpositionslider");
  slider.addEventListener('input', function () {
    x_offset = slider.value;
    drawScene();
  });

  function drawScene() {
    // Rectangle Uniform Setting
    // Rectangle Buffer Binding
    gl.useProgram(program);
    gl.bindVertexArray(rectangleVAO);

    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // gl.enableVertexAttribArray(0);
    // gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

    var location = gl.getUniformLocation(program, "u_color");
    gl.uniform4fv(location, [0.8, 0.3, 0.8, 1]);

    var offsetLocation = gl.getUniformLocation(program, "u_offset");
    gl.uniform4fv(offsetLocation, [x_offset, 0.0, 0.0, 0.0]);

    // Draw Rectangle
    gl.drawElements(gl.TRIANGLES,
      6,
      gl.UNSIGNED_SHORT,
      0
    );

    gl.useProgram(null);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    // Triangle Uniform Setting
    // Triangle Buffer Binding
    gl.useProgram(triangleProgram);
    gl.bindVertexArray(triangleVAO);

    // gl.bindBuffer(gl.ARRAY_BUFFER, trianglePositionBuffer);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);
    // gl.enableVertexAttribArray(0);
    // gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

    // Draw Triangle
    gl.drawElements(gl.TRIANGLES,
      3,
      gl.UNSIGNED_SHORT,
      0
    );

    gl.useProgram(null);
    gl.bindVertexArray(null);
  }

  drawScene();
}

main();