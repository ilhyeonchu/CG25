"use strict";

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

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

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

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  )

  var program = webglUtils.createProgramFromSources(gl,
    [vertexShaderSource, fragmentShaderSource]);

  gl.useProgram(program);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

  var x_offset = 0.0;
  const slider = document.getElementById("xpositionslider");
  slider.addEventListener('input', function () {
    x_offset = slider.value;
    drawScene();
  });

  function drawScene() {
    var location = gl.getUniformLocation(program, "u_color");
    gl.uniform4fv(location, [0.8, 0.3, 0.8, 1]);

    var offsetLocation = gl.getUniformLocation(program, "u_offset");
    gl.uniform4fv(offsetLocation, [x_offset, 0.0, 0.0, 0.0]);

    gl.drawElements(gl.TRIANGLES,
      6,
      gl.UNSIGNED_SHORT,
      0
    );
  }

  drawScene();
}

main();