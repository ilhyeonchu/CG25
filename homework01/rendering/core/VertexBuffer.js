export class VertexBuffer {
    gl;
    id;

    constructor(gl, data) 
    {   
        this.gl = gl;
        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }

    Bind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.id);
    }

    Unbind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
}