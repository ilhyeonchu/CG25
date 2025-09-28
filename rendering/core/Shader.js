export class Shader {
    gl;
    id;
    locations = {};

    constructor(gl, vertexShaderSource, fragmentSource) {
        this.gl = gl;
        this.id = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentSource]);
    }

    Bind() {
        this.gl.useProgram(this.id);
    }

    Unbind() {
        this.gl.useProgram(null);
    }

    GetUniformLocation(name) {
        let location = 0;
        if (name in this.locations) {
            location = this.locations[name];
        } else {
            location = this.gl.getUniformLocation(this.id, name);
            this.locations[name] = location;
        }
        return location;
    }

    SetUniform4f(name, v0, v1, v2, v3) {
        let location = this.GetUniformLocation(name);
        this.gl.uniform4f(location, v0, v1, v2, v3);
    }
}