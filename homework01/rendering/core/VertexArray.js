export class VertexArray {
    gl;
    id;

    constructor(gl) {
        this.gl = gl;
        this.id = gl.createVertexArray();
    }

    Bind() {
        this.gl.bindVertexArray(this.id);
    }

    Unbind() {
        this.gl.bindVertexArray(null);
    }

    AddBuffer(vb, countArray, normalizedArray) {
        this.Bind();
        vb.Bind();

        var stride = 0;
        for (let i = 0; i < countArray.length; i++) {
            stride += countArray[i] * 4;
        }

        var offset = 0;
        for (let i = 0; i < countArray.length; i++) {
            this.gl.enableVertexAttribArray(i);
            this.gl.vertexAttribPointer(i, 
                countArray[i], 
                this.gl.FLOAT, 
                normalizedArray[i], 
                stride, 
                offset);

            offset += countArray[i] * 4;
        }
    }
}