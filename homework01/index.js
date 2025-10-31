"use strict";

import { VertexBuffer } from "./rendering/core/VertexBuffer.js";
import { IndexBuffer } from "./rendering/core/IndexBuffer.js";
import { VertexArray } from "./rendering/core/VertexArray.js";
import { Shader } from "./rendering/core/Shader.js";
import { Renderer } from "./rendering/core/Renderer.js";
import { OrbitCamera } from "./rendering/core/OrbitCamera.js";

import basicVertex from "./resources/shaders/assignmentVertex.js";
import basicFragment from "./resources/shaders/assignmentFragment.js";

const { mat4, vec4 } = glMatrix;

function main() {
    // main() 함수 내 필요한 모든 내용을 작성 하십시오.
    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    // 모델 만들어야할듯?

    let program = new Shader(gl, basicVertex, basicFragment);
    let renderer = new Renderer(gl);

    const worldLocalSlider = document.getElementById("worldlocalslider");
    worldLocalSlider.addEventListener("input", function () {
        const worldlocal = worldLocalSlider.value;
        let modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec4.fromValues(worldlocal, 0, 0, 0));
        program.setUniform("u_ModelMetrix", modelMatrix);
    });

    const angleSlider = document.getElementById("angleslider");
    angleSlider.addEventListener("input", function () {
        
    })

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
    // 올바른 결과를 보기 위해서는 깊이 테스트가 활성화되어 있어야 합니다.
    // Draw Call을 호출하기 전에 아래 함수를 호출하십시오.     
    gl.enable(gl.DEPTH_TEST);


}

main();
