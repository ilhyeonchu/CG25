export class Depthmap {
    gl;
    width;
    height;
    mapID;
    framebufferID;
    
    constructor(gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;

        this.mapID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.mapID);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  

        this.framebufferID = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferID);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.mapID, 0);

        let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console.log("Framebuffer not complete: " + status.toString());
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    Bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferID);
    }

    Unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    Read(unit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.mapID);
    }
}