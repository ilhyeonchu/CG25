export class Shader {
    gl;
    id;
    locations = {};

    constructor(gl, vertexShaderSource, fragmentShaderSource) 
    {
        this.gl = gl;
        this.id = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    }

    Bind() 
    {
        this.gl.useProgram(this.id);
    }

    Unbind() 
    {
        this.gl.useProgram(null);
    }

    GetUniformLocation(name) 
    {
        let location = 0;
        if (name in this.locations)
        {
            location = this.locations[name];
        }
        else
        {
            location = this.gl.getUniformLocation(this.id, name);
            this.locations[name] = location;
        }
        return location;
    }

    SetUniform4f(name, v0, v1, v2, v3)
    {
        let location = this.GetUniformLocation(name);
        this.gl.uniform4f(location, v0, v1, v2, v3);
    }

    SetUniformMatrix4f(name, matrix)
    {
        let location = this.GetUniformLocation(name);
        this.gl.uniformMatrix4fv(location, false, matrix);
    }

    SetUniform1i(name, value)
    {
        let location = this.GetUniformLocation(name);
        this.gl.uniform1i(location, value);
    }
}