export class Renderer {
    gl;

    constructor(gl) {
        this.gl = gl;
    }

    Clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    Draw(vao, ib, shader) {
        shader.Bind();
        vao.Bind();
        ib.Bind();

        let primitiveType = this.gl.TRIANGLES;
        var indexCount = ib.GetCount();
        let indexOffset = 0;

        this.gl.drawElements(primitiveType, indexCount, this.gl.UNSIGNED_SHORT, indexOffset);

        shader.Unbind();
        ib.Unbind();
        vao.Unbind();
    }
}
