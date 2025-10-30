export class IndexBuffer {
    gl;
    id;
    count;

    constructor(gl, data, count) {
        this.gl = gl;
        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

        this.count = count;
    }

    Bind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.id);
    }

    Unbind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    GetCount() {
        return this.count;
    }
}