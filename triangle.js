class Triangle2D {
    static shaderProgram = -1;
    static aPositionShader = -1;
    static aColorShader = -1;

    vertexPositions = [];
    vertexColors = [];
    positionBuffer = null;
    colorBuffer = null;

    static initialize() {
        Triangle2D.shaderProgram = initShaders(gl, "./vshader.glsl", "./fshader.glsl");

        if (!Triangle2D.shaderProgram) {
            console.error("Failed to initialize shaders.");
            return;
        }

        Triangle2D.aPositionShader = gl.getAttribLocation(Triangle2D.shaderProgram, "aPosition");
        Triangle2D.aColorShader = gl.getAttribLocation(Triangle2D.shaderProgram, "aColor");

        if (Triangle2D.aPositionShader === -1 || Triangle2D.aColorShader === -1) {
            console.error("Failed to get shader attribute locations.");
        }
    }

    constructor(x, y, size) {
        const height = (Math.sqrt(3) / 2) * size;

        this.vertexPositions = [
            vec2(x, y + height / 2), // top vertex
            vec2(x - size / 2, y - height / 2), // bottom left vertex
            vec2(x + size / 2, y - height / 2)  // bottom right vertex
        ];

        this.vertexColors = [
            vec3(1.0, 0.0, 0.0), // red top
            vec3(0.0, 1.0, 0.0), // green bottome left
            vec3(0.0, 0.0, 1.0) // blue bottom right
        ];

        if (Triangle2D.shaderProgram === -1) {
            Triangle2D.initialize();
        }
    }

    bufferDataToGPU() {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertexPositions), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertexColors), gl.STATIC_DRAW);
    }

    draw() {
        gl.useProgram(Triangle2D.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(Triangle2D.aPositionShader, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(Triangle2D.aPositionShader);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(Triangle2D.aColorShader, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(Triangle2D.aColorShader);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexPositions.length);

        gl.disableVertexAttribArray(Triangle2D.aPositionShader);
        gl.disableVertexAttribArray(Triangle2D.aColorShader);

        if (!gl.getProgramParameter(Triangle2D.shaderProgram, gl.LINK_STATUS)) {
            console.error('Shader program failed to link:', gl.getProgramInfoLog(Triangle2D.shaderProgram));
        }
    }
}