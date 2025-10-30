"use strict";

import { Shader } from './rendering/core/Shader.js';
import { Renderer } from './rendering/core/Renderer.js';
import { OrbitCamera } from './rendering/core/OrbitCamera.js';
import { Model } from './rendering/core/Model.js';
import { Texture } from './rendering/core/Texture.js';

import basicVertex from './resources/shaders/basicVertex.js';
import basicFragment from './resources/shaders/basicFragment.js';

const { mat4, vec4 } = glMatrix;

async function main() {
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  let checkerTexture = new Texture(gl);
  checkerTexture.LoadTexture("./resources/textures/CustomUVChecker_byValle_2K.png");

  let externalTexture = new Texture(gl);
  externalTexture.LoadTexture("https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791156006749.jpg");

  let cubeModel = new Model(gl);
  await cubeModel.LoadModel('./resources/models/cube.obj');

  let teapotModel = new Model(gl);
  await teapotModel.LoadModel('./resources/models/teapot.obj');

  // Rectangle Program
  let program = new Shader(gl, basicVertex, basicFragment);

  let renderer = new Renderer(gl);

  const pitchSlider = document.getElementById("pitchslider");
  pitchSlider.addEventListener("input", function () {
    camera.pitch = pitchSlider.value;
    camera.Update();
  });

  const yawSlider = document.getElementById("yawslider");
  yawSlider.addEventListener("input", function () {
    camera.yaw = yawSlider.value;
    camera.Update();
  });

  const distanceSlider = document.getElementById("distanceslider");
  distanceSlider.addEventListener("input", function () {
    camera.distance = distanceSlider.value;
    camera.Update();
  });

  let at = [0, 0, 0];
  let yaw = yawSlider.value;
  let pitch = pitchSlider.value;
  let distance = distanceSlider.value;
  let camera = new OrbitCamera(at, yaw, pitch, distance);

  let projectionMatrix = mat4.create();
  let fovy = 60.0 * Math.PI / 180;
  let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  let near = 0.1;
  let far = 100.0;
  mat4.perspective(projectionMatrix, fovy, aspect, near, far);

  requestAnimationFrame(drawScene);

  let rotationAngle = 0.0;

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    rotationAngle += 0.5 * Math.PI / 180.0;

    renderer.Clear();

    program.Bind();

    {
      let modelMatrix = mat4.create();
      mat4.fromYRotation(modelMatrix, rotationAngle);
      mat4.translate(modelMatrix, modelMatrix, [0, 0, -3.0]);
      program.SetUniformMatrix4f("u_model", modelMatrix);
      program.SetUniformMatrix4f("u_view", camera.GetViewMatrix());
      program.SetUniformMatrix4f("u_projection", projectionMatrix);
      externalTexture.Bind(0);
      program.SetUniform1i("u_texture", 0);
      cubeModel.RenderModel(renderer);

      modelMatrix = mat4.create();
      mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1]);
      program.SetUniformMatrix4f("u_model", modelMatrix);
      checkerTexture.Bind(0);
      program.SetUniform1i("u_texture", 0);
      teapotModel.RenderModel(renderer);
    }
    program.Unbind();

    requestAnimationFrame(drawScene);
  }

}

main();