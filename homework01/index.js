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

async function main() {
    // main() 함수 내 필요한 모든 내용을 작성 하십시오.
    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    // 모델 만들어야할듯?
    var firstPositions = [
        -1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, 1.0, 0.0,
        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
        -1.5, -0.5, 0.5, 1.0, 1.0, 0.0,
        -1.5, -0.5, -0.5, 0.5, 1.0, 0.0,
        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
        -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
        -1.5, 0.5, 0.5, 1.0, 1.0, 0.0,
        -1.5, 0.5, -0.5, 0.5, 1.0, 0.0,
    ]

    var secondPositions = [
        1.0, 0, 0, 1.0, 0.0, 0.0,
        0.5, -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
        1.5, -0.5, 0.5, 1.0, 1.0, 0.0,
        1.5, -0.5, -0.5, 0.5, 1.0, 0.0,
        0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
        1.5, 0.5, 0.5, 1.0, 1.0, 0.0,
        1.5, 0.5, -0.5, 0.5, 1.0, 0.0,
    ]

    var indices = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 1,
        0, 5, 6,
        0, 6, 7,
        0, 7, 8,
        0, 8, 5,
    ];

    var firstVAO = new VertexArray(gl);
    let firstVB = new VertexBuffer(gl, firstPositions);
    firstVAO.AddBuffer(firstVB, [3, 3], [false, false]);
    let firstIB = new IndexBuffer(gl, indices, indices.length);

    firstVAO.Unbind();
    firstVB.Unbind();
    firstIB.Unbind();

    var secondVAO = new VertexArray(gl);
    let secondVB = new VertexBuffer(gl, secondPositions);
    secondVAO.AddBuffer(secondVB, [3, 3], [false, false]);
    let secondIB = new IndexBuffer(gl, indices, indices.length);

    secondVAO.Unbind();
    secondVB.Unbind();
    secondIB.Unbind();

    let program = new Shader(gl, basicVertex, basicFragment);
    let renderer = new Renderer(gl);

    const pitchSlider = document.getElementById("pitchslider");
    const yawSlider = document.getElementById("yawslider");
    const distanceSlider = document.getElementById("distanceslider");

    let at = [0, 0, 0];
    let yaw = parseFloat(yawSlider.value);
    let pitch = parseFloat(pitchSlider.value);
    let distance = parseFloat(distanceSlider.value);
    let camera = new OrbitCamera(at, yaw, pitch, distance);

    let projectionMatrix = mat4.create();
    const fovy = 60.0 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const near = 0.1;
    const far = 100.0;
    mat4.perspective(projectionMatrix, fovy, aspect, near, far);

    const worldLocalSlider = document.getElementById("worldlocalslider");
    let state = "world";
    worldLocalSlider.addEventListener("input", function () {
        let value = worldLocalSlider.value;
        if (value == 1) {
            state = "local";
        } else {
            state = "world";
        }
        drawScene();
    });

    const angleSlider = document.getElementById("angleslider");
    let rotationAngle = 0.0;
    angleSlider.addEventListener("input", function () {
        rotationAngle = angleSlider.value;
        drawScene();
    });

    pitchSlider.addEventListener("input", function () {
        camera.pitch = pitchSlider.value;
        camera.Update();
        drawScene();
    });

    yawSlider.addEventListener("input", function () {
        camera.yaw = yawSlider.value;
        camera.Update();
        drawScene();
    });

    distanceSlider.addEventListener("input", function () {
        camera.distance = distanceSlider.value;
        camera.Update();
        drawScene();
    });

    // 올바른 결과를 보기 위해서는 깊이 테스트가 활성화되어 있어야 합니다.
    // Draw Call을 호출하기 전에 아래 함수를 호출하십시오.    
    gl.enable(gl.DEPTH_TEST);

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        renderer.Clear();

        program.Bind();
        {
            const rotationAngleRad = rotationAngle * Math.PI / 180;

            let modelMatrix = mat4.create();
            if (state === "world") {
                mat4.fromYRotation(modelMatrix, rotationAngleRad);
            } else {
                const pivot1 = [-1.0, 0.0, 0.0];
                mat4.translate(modelMatrix, modelMatrix, pivot1);
                mat4.rotateY(modelMatrix, modelMatrix, rotationAngleRad);
                mat4.translate(modelMatrix, modelMatrix, [-pivot1[0], -pivot1[1], -pivot1[2]]);
            }

            program.SetUniformMatrix4f("u_view", camera.GetViewMatrix());
            program.SetUniformMatrix4f("u_projection", projectionMatrix);
            program.SetUniformMatrix4f("u_model", modelMatrix);
            renderer.Draw(firstVAO, firstIB, program);

            program.Bind();

            modelMatrix = mat4.create();
            if (state === "world") {
                mat4.fromYRotation(modelMatrix, rotationAngleRad);
            } else {
                const pivot2 = [1.0, 0.0, 0.0];
                mat4.translate(modelMatrix, modelMatrix, pivot2);
                mat4.rotateY(modelMatrix, modelMatrix, rotationAngleRad);
                mat4.translate(modelMatrix, modelMatrix, [-pivot2[0], -pivot2[1], -pivot2[2]]);
            }

            program.SetUniformMatrix4f("u_view", camera.GetViewMatrix());
            program.SetUniformMatrix4f("u_projection", projectionMatrix);
            program.SetUniformMatrix4f("u_model", modelMatrix);
            renderer.Draw(secondVAO, secondIB, program);
        }
        program.Unbind();

    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    requestAnimationFrame(drawScene);

}

main();
