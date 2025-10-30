export class Texture {
    gl;
    id;
    image;

    constructor(gl) {
        this.gl = gl;
        this.id = this.gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0,
            gl.RGBA, 1, 1, 0,
            gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    LoadTexture(path) {
        this.image = new Image();
        this.image.src = path;
        this.image.crossOrigin = "";

        this.image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0,
                this.gl.RGBA, this.gl.RGBA,
                this.gl.UNSIGNED_BYTE, this.image);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        };
    }

    Bind(unit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    }

    Unbind() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
}