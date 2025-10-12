import { VertexBuffer } from './VertexBuffer.js';
import { IndexBuffer } from './IndexBuffer.js';
import { VertexArray } from './VertexArray.js';

export class Model {
    gl;
    VAO;
    VBO;
    IBO;

    constructor(gl) {
        this.gl = gl;
    }

    async LoadModel(path) {
        const response = await fetch(path);
        const text = await response.text();
        let mesh = new OBJ.Mesh(text);

        let meshVertexData = [];

        let vertexCount = mesh.vertices.length;
        for (let i = 0; i < vertexCount; i++) {
            meshVertexData.push(mesh.vertices[3 * i], mesh.vertices[3 * i + 1], mesh.vertices[3 * i + 2]);
            meshVertexData.push(mesh.textures[2 * i], mesh.textures[2 * i + 1]);
            meshVertexData.push(mesh.vertexNormals[3 * i], mesh.vertexNormals[3 * i + 1], mesh.vertexNormals[3 * i + 2]);
        }

        this.VAO = new VertexArray(this.gl);
        this.VBO = new VertexBuffer(this.gl, meshVertexData);
        this.VAO.AddBuffer(this.VBO, [3, 2, 3], [false, false, false]);
        this.IBO = new IndexBuffer(this.gl, mesh.indices, mesh.indices.length);

        this.VAO.Unbind();
        this.VBO.Unbind();
        this.IBO.Unbind();
    }

    RenderModel(renderer) {
        renderer.Draw(this.VAO, this.IBO);
    }
}