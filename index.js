"use strict";

import { Shader } from './rendering/core/Shader.js';
import { Renderer } from './rendering/core/Renderer.js';
import { OrbitCamera } from './rendering/core/OrbitCamera.js';
import { Model } from './rendering/core/Model.js';
import { Texture } from './rendering/core/Texture.js';
import { DirectionalLight } from './rendering/light/DirectionalLight.js';
import { Material } from './rendering/core/Material.js';

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

  let teapotModel = new Model(gl);
  await teapotModel.LoadModel('./resources/models/teapot.obj');

  // Rectangle Program
  let program = new Shader(gl, basicVertex, basicFragment);

  let renderer = new Renderer(gl);



  let at = [0, 0, 0];
  let yaw = 90;
  let pitch = 0;
  let distance = 5;
  let camera = new OrbitCamera(at, yaw, pitch, distance);

  let projectionMatrix = mat4.create();
  let fovy = 60.0 * Math.PI / 180;
  let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  let near = 0.1;
  let far = 100.0;
  mat4.perspective(projectionMatrix, fovy, aspect, near, far);

  let light = new DirectionalLight([1.0, 1.0, 1.0], [2.0, 1.0, -2.0], 0.1, 1.0);

  let material = new Material(1.0, 64.0);

  SetupSliders();
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
      mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1]);
      program.SetUniformMatrix4f("u_model", modelMatrix);
      program.SetUniformMatrix4f("u_view", camera.GetViewMatrix());
      program.SetUniformMatrix4f("u_projection", projectionMatrix);
      program.SetUniform3f("u_eyePosition", camera.eye[0], camera.eye[1], camera.eye[2]);
      program.SetMaterial(material);
      checkerTexture.Bind(0);
      program.SetUniform1i("u_texture", 0);
      program.SetLight(light);
      teapotModel.RenderModel(renderer);
    }
    program.Unbind();

    requestAnimationFrame(drawScene);
  }

  function SetupSliders() {
    const pitchSlider = document.getElementById("pitchslider");
    const yawSlider = document.getElementById("yawslider");
    const distanceSlider = document.getElementById("distanceslider");
    const directionXSlider = document.getElementById("directionx");
    const directionYSlider = document.getElementById("directiony");
    const directionZSlider = document.getElementById("directionz");
    const specularIntensitySlider = document.getElementById("specularIntensity");
    const shininessSlider = document.getElementById("shininess");

    pitchSlider.addEventListener("input", function () {
      camera.pitch = pitchSlider.value;
      camera.Update();
    });

    yawSlider.addEventListener("input", function () {
      camera.yaw = yawSlider.value;
      camera.Update();
    });

    distanceSlider.addEventListener("input", function () {
      camera.distance = distanceSlider.value;
      camera.Update();
    });

    directionXSlider.addEventListener("input", function () {
      light.direction[0] = directionXSlider.value;
    });

    directionYSlider.addEventListener("input", function () {
      light.direction[1] = directionYSlider.value;
    });

    directionZSlider.addEventListener("input", function () {
      light.direction[2] = directionZSlider.value;
    });

    specularIntensitySlider.addEventListener("input", function () {
      material.specularIntensity = specularIntensitySlider.value;
    });

    shininessSlider.addEventListener("input", function () {
      material.shininess = shininessSlider.value;
    });
  }
}

main();