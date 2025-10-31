"use strict";

import { VertexBuffer } from "./rendering/core/VertexBuffer.js";
import { IndexBuffer } from "./rendering/core/IndexBuffer.js";
import { VertexArray } from "./rendering/core/VertexArray.js";
import { Shader } from "./rendering/core/Shader.js";
import { Renderer } from "./rendering/core/Renderer.js";

import basicVertex from "./resources/shaders/assignmentVertex.js";
import basicFragment from "./resources/shaders/assignmentFragment.js";

const { mat4 } = glMatrix;

const firstPositions = [
    -1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    -0.5, -0.5, -0.5, 0.0, 1.0, 0.0,
    -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
    -1.5, -0.5, 0.5, 1.0, 1.0, 0.0,
    -1.5, -0.5, -0.5, 0.5, 1.0, 0.0,
    -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
    -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
    -1.5, 0.5, 0.5, 1.0, 1.0, 0.0,
    -1.5, 0.5, -0.5, 0.5, 1.0, 0.0,
];

const secondPositions = [
    1.0, 0.0, 0.0,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    1.5, -0.5, 0.5,
    1.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    1.5, 0.5, 0.5,
    1.5, 0.5, -0.5,
];

const indices = [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 1,
    0, 5, 6,
    0, 6, 7,
    0, 7, 8,
    0, 8, 5,
];

function buildInterleavedVertices(raw, componentsPerVertex, colorStrategy) {
    const vertexCount = raw.length / componentsPerVertex;
    const vertexStride = 8; // vec4 position + vec4 color
    const result = new Float32Array(vertexCount * vertexStride);

    for (let i = 0; i < vertexCount; i++) {
        const dstOffset = i * vertexStride;
        const srcOffset = i * componentsPerVertex;

        const x = raw[srcOffset + 0];
        const y = raw[srcOffset + 1];
        const z = raw[srcOffset + 2];

        result[dstOffset + 0] = x;
        result[dstOffset + 1] = y;
        result[dstOffset + 2] = z;
        result[dstOffset + 3] = 1.0;

        let color;
        if (colorStrategy === "fromRaw") {
            const r = raw[srcOffset + 3];
            const g = raw[srcOffset + 4];
            const b = raw[srcOffset + 5];
            color = [r, g, b, 1.0];
        } else if (typeof colorStrategy === "function") {
            color = colorStrategy(i, vertexCount);
        } else {
            color = [0.7, 0.7, 0.7, 1.0];
        }

        result.set(color, dstOffset + 4);
    }

    return result;
}

function createSecondColorStrategy() {
    const colors = [
        [0.2, 0.6, 1.0, 1.0],
        [0.2, 1.0, 0.6, 1.0],
        [1.0, 0.4, 0.2, 1.0],
        [1.0, 0.8, 0.2, 1.0],
        [0.5, 0.2, 1.0, 1.0],
    ];
    return function (index) {
        return colors[index % colors.length];
    };
}

function createMeshData() {
    const firstVertices = buildInterleavedVertices(firstPositions, 6, "fromRaw");
    const secondVertices = buildInterleavedVertices(secondPositions, 3, createSecondColorStrategy());
    return {
        first: {
            vertices: firstVertices,
            indices: new Uint16Array(indices),
        },
        second: {
            vertices: secondVertices,
            indices: new Uint16Array(indices),
        },
    };
}

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth || canvas.width;
    const displayHeight = canvas.clientHeight || canvas.height;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        return true;
    }
    return false;
}

function main() {
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        console.error("WebGL2 not supported");
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.15, 0.15, 0.18, 1.0);

    const shader = new Shader(gl, basicVertex, basicFragment);
    const renderer = new Renderer(gl);

    const mesh = createMeshData();

    const firstVB = new VertexBuffer(gl, mesh.first.vertices);
    const firstVAO = new VertexArray(gl);
    firstVAO.AddBuffer(firstVB, [4, 4], [false, false]);

    const secondVB = new VertexBuffer(gl, mesh.second.vertices);
    const secondVAO = new VertexArray(gl);
    secondVAO.AddBuffer(secondVB, [4, 4], [false, false]);

    const indexBuffer = new IndexBuffer(gl, mesh.first.indices, mesh.first.indices.length);

    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();
    const firstModelMatrix = mat4.create();
    const secondModelMatrix = mat4.create();

    const eye = [0.0, 2.0, 6.0];
    const target = [0.0, 0.0, 0.0];
    const up = [0.0, 1.0, 0.0];

    mat4.lookAt(viewMatrix, eye, target, up);

    function render(time) {
        const seconds = time * 0.001;

        const resized = resizeCanvasToDisplaySize(canvas);
        if (resized) {
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        const aspect = canvas.width / Math.max(1, canvas.height);
        mat4.perspective(projectionMatrix, Math.PI / 4, aspect, 0.1, 100.0);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.identity(firstModelMatrix);
        mat4.rotateY(firstModelMatrix, firstModelMatrix, seconds * 0.8);

        mat4.identity(secondModelMatrix);
        mat4.rotateY(secondModelMatrix, secondModelMatrix, -seconds * 0.6);

        shader.Bind();
        shader.SetUniformMatrix4f("u_projection", projectionMatrix);
        shader.SetUniformMatrix4f("u_view", viewMatrix);
        shader.SetUniformMatrix4f("u_model", firstModelMatrix);
        shader.Unbind();

        renderer.Draw(firstVAO, indexBuffer, shader);

        shader.Bind();
        shader.SetUniformMatrix4f("u_model", secondModelMatrix);
        shader.Unbind();

        renderer.Draw(secondVAO, indexBuffer, shader);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
