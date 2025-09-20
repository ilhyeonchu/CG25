export class IndexBuffer {
    id;
    count;

    constructor(gl, data, count) {
        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

        this.count = count;
    }

    bind(gl) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
    }

    unbind(gl) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    getCount() {
        return this.count;
    }
}