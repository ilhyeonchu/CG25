"use strict";

import { VertexBuffer } from './rendering/core/VertexBuffer.js';
import { IndexBuffer } from './rendering/core/IndexBuffer.js';
import { VertexArray } from './rendering/core/VertexArray.js';

import rectangleFragment from './resources/shaders/rectangleFragment.js';
import rectangleVertex from './resources/shaders/rectangleVertex.js';
import triangleFragment from './resources/shaders/triangleFragment.js';
import triangleVertex from './resources/shaders/triangleVertex.js';
import { Shader } from './rendering/core/Shader.js';
import { Renderer } from './rendering/core/Renderer.js';


function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Rectangle
  var positions = [
    // x, y, r, g, b, a
    -0.5, -0.5, 1.0, 0.0, 0.0, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
    0.5, 0.5, 0.0, 0.0, 1.0, 1.0,
    -0.5, 0.5, 0.8, 0.2, 0.3, 1.0,
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
  let rectangleVAO = new VertexArray(gl);
  let rectangleVB = new VertexBuffer(gl, positions);
  rectangleVAO.AddBuffer(rectangleVB, [2, 4], [false]);
  let rectangleIB = new IndexBuffer(gl, indices, 6);

  rectangleVAO.Unbind();
  rectangleVB.Unbind();
  rectangleIB.Unbind();

  // Triangle Buffer
  let triangleVAO = new VertexArray(gl);
  let triangleVB = new VertexBuffer(gl, trianglePositions);
  triangleVAO.AddBuffer(triangleVB, [2], [false]);
  let triangleIB = new IndexBuffer(gl, triangleIndices, 3);

  triangleVAO.Unbind();
  triangleVB.Unbind();
  triangleIB.Unbind();


  // Rectangle Program
  var rectangleProgram = new Shader(gl, rectangleVertex, rectangleFragment);

  // Triangle Program
  var triangleProgram = new Shader(gl, triangleVertex, triangleFragment);

  var x_offset = 0.0;
  const slider = document.getElementById("xpositionslider");
  slider.addEventListener('input', function () {
    x_offset = slider.value;
    drawScene();
  });

  let renderer = new Renderer(gl);

  function drawScene() {
    renderer.Clear();

    rectangleProgram.Bind();
    rectangleProgram.SetUniform4f("u_offset", x_offset, 0.0, 0.0, 0.0);
    renderer.Draw(rectangleVAO, rectangleIB, rectangleProgram);

    renderer.Draw(triangleVAO, triangleIB, triangleProgram);
  }

  drawScene();
}

main();