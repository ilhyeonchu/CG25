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

import depthmapFragment from './resources/shaders/depthmapFragment.js';
import depthmapVertex from './resources/shaders/depthmapVertex.js';

import depthmapDebugFragment from './resources/shaders/depthmapDebugFragment.js';

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

  let quadModel = new Model(gl);
  await quadModel.LoadModel('./resources/models/quad.obj');

  // Rectangle Program
  let program = new Shader(gl, basicVertex, basicFragment);
  let depthmapProgram = new Shader(gl, depthmapVertex, depthmapFragment);
  let depthmapDebugProgram = new Shader(gl, basicVertex, depthmapDebugFragment);

  let renderer = new Renderer(gl);


  let at = [0, 0, 0,];
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

  let depthmapWidth = 1024;
  let depthmapHeight = 1024;
  let light = new DirectionalLight(gl, [1.0, 1.0, 1.0], [2.0, 1.0, -2.0], 0.1, 1.0, depthmapWidth, depthmapHeight);

  let material = new Material(1.0, 64.0);

  SetupSliders();
  requestAnimationFrame(drawScene);

  function drawScene() {
    //1st pass
    light.depthmap.Bind();
    depthmapProgram.Bind();
    {
      let modelMatrix = mat4.create();
      mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1]);

      depthmapProgram.SetUniformMatrix4f("u_model", modelMatrix);
      depthmapProgram.SetDepthmapLightTransform(light);

      renderer.Clear();
      gl.viewport(0, 0, light.depthmapWidth, light.depthmapHeight);
      teapotModel.RenderModel(renderer);
    }
    light.depthmap.Unbind();
    depthmapProgram.Unbind();

    //2nd pass
    {
      webglUtils.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      depthmapDebugProgram.Bind();
      {
        let modelMatrix = mat4.create();
        mat4.scale(modelMatrix, modelMatrix, [0.02, 0.02, 0.02]);
        mat4.rotateX(modelMatrix, modelMatrix, 3.0*Math.PI/2.0);
        mat4.rotateY(modelMatrix, modelMatrix, Math.PI);

        depthmapDebugProgram.SetUniformMatrix4f("u_model", modelMatrix);
        depthmapDebugProgram.SetUniformMatrix4f("u_view", camera.GetViewMatrix());
        depthmapDebugProgram.SetUniformMatrix4f("u_projection", projectionMatrix);

        light.depthmap.Read(0);
        depthmapDebugProgram.SetUniform1i("u_depthmap", 0);

        renderer.Clear();
        gl.viewport(0, 0, light.depthmapWidth, light.depthmapHeight);
        quadModel.RenderModel(renderer);
      }
    }

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