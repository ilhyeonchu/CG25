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

    SetUniformMatrix4f(name, matrix) {
        let location = this.GetUniformLocation(name);
        this.gl.uniformMatrix4fv(location, false, matrix);
    }

    SetUniform1i(name, value) {
        let location = this.GetUniformLocation(name);
        this.gl.uniform1i(location, value);
    }

    SetUniform3f(name, v0, v1, v2) {
        let location = this.GetUniformLocation(name);
        this.gl.uniform3f(location, v0, v1, v2);
    }

    SetUniform1f(name, value) {
        let location = this.GetUniformLocation(name);
        this.gl.uniform1f(location, value);
    }

    SetLight(light) {
        this.SetUniform3f("u_light.color", light.lightColor[0], light.lightColor[1], light.lightColor[2]);
        this.SetUniform3f("u_light.direction", light.direction[0], light.direction[1], light.direction[2]);
        this.SetUniform1f("u_light.diffuseIntensity", light.diffuseIntensity);
        this.SetUniform1f("u_light.ambientIntensity", light.ambientIntensity);
    }
}