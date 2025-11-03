export class Renderer {
    gl;

    constructor(gl) {
        this.gl = gl;
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
    }

    Clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    Draw(vao, ib, shader) {
        vao.Bind();
        ib.Bind();

        let primitiveType = this.gl.TRIANGLES;
        var indexCount = ib.GetCount();
        let indexOffset = 0;

        this.gl.drawElements(primitiveType, indexCount, this.gl.UNSIGNED_SHORT, indexOffset);

        ib.Unbind();
        vao.Unbind();
    }
}
