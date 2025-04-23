class Square2D {
    static shaderProgram = -1;
    static aPositionShader = -1;
    static aColorShader = -1;

    vertexPositions = [];
    vertexColors = [];
    positionBuffer = null;
    colorBuffer = null;

    static initialize() {
        Square2D.shaderProgram = initShaders(gl, "./vshader.glsl", "./fshader.glsl");

        if (!Square2D.shaderProgram) {
            console.error("Failed to initialize shaders.");
            return;
        }
    
        Square2D.aPositionShader = gl.getAttribLocation(Square2D.shaderProgram, "aPosition");
        Square2D.aColorShader = gl.getAttribLocation(Square2D.shaderProgram, "aColor");
    
        if (Square2D.aPositionShader === -1 || Square2D.aColorShader === -1) {
            console.error("Failed to get shader attribute locations.");
        }
    }

    constructor(x, y, size, color) {
        const halfSize = size / 2;

        this.vertexPositions = [
            vec2(x - halfSize, y - halfSize), // bottom left
            vec2(x - halfSize, y + halfSize), // top left
            vec2(x + halfSize, y + halfSize), // top right
            vec2(x + halfSize, y - halfSize)  // bottom right
        ];

        this.vertexColors = [
            color, color, color, color
        ];

        if (Square2D.shaderProgram === -1) {
            Square2D.initialize();
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
        gl.useProgram(Square2D.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(Square2D.aPositionShader, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(Square2D.aPositionShader);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(Square2D.aColorShader, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(Square2D.aColorShader);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertexPositions.length);

        gl.disableVertexAttribArray(Square2D.aPositionShader);
        gl.disableVertexAttribArray(Square2D.aColorShader);

        if (!gl.getProgramParameter(Square2D.shaderProgram, gl.LINK_STATUS)) {
            console.error('Shader program failed to link:', gl.getProgramInfoLog(Square2D.shaderProgram));
        }
    }
}

