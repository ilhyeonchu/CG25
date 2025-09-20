export class VertexBuffer {
    id;

    constructor(gl, data) {
        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }

    bind(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    }

    unbind(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}