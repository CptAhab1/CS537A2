class Circle2D {
    static shaderProgram = -1;
    static aPositionShader = -1;
    static aColorShader = -1;

    vertexPositions = [];
    vertexColors = [];
    positionBuffer = null;
    colorBuffer = null;

    static initialize() {
        Circle2D.shaderProgram = initShaders(gl, "./vshader.glsl", "./fshader.glsl");

        if (!Circle2D.shaderProgram) {
            console.error("Failed to initialize shaders.");
            return;
        }

        Circle2D.aPositionShader = gl.getAttribLocation(Circle2D.shaderProgram, "aPosition");
        Circle2D.aColorShader = gl.getAttribLocation(Circle2D.shaderProgram, "aColor");

        if (Circle2D.aPositionShader === -1 || Circle2D.aColorShader === -1) {
            console.error("Failed to get shader attribute locations.");
        }
    }

    constructor(x, y, radius, segments) {
        const centerColor = vec3(0.0, 0.0, 0.0);
        this.vertexPositions = [];
        this.vertexColors = [];

        const firstAngle = 0;
        const firstX = x + radius * Math.cos(firstAngle);
        const firstY = y + radius * Math.sin(firstAngle);
        this.vertexPositions.push(vec2(firstX, firstY));
        this.vertexColors.push(centerColor);

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);

            // red darkens based on the angle
            const red = (angle / (2 * Math.PI));
            const color = vec3(red, 0.0, 0.0);

            this.vertexPositions.push(vec2(px, py));
            this.vertexColors.push(color);
        }

        if (Circle2D.shaderProgram === -1) {
            Circle2D.initialize();
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
        gl.useProgram(Circle2D.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(Circle2D.aPositionShader, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(Circle2D.aPositionShader);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(Circle2D.aColorShader, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(Circle2D.aColorShader);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertexPositions.length);

        gl.disableVertexAttribArray(Circle2D.aPositionShader);
        gl.disableVertexAttribArray(Circle2D.aColorShader);

        if (!gl.getProgramParameter(Circle2D.shaderProgram, gl.LINK_STATUS)) {
            console.error('Shader program failed to link:', gl.getProgramInfoLog(Circle2D.shaderProgram));
        }
    }
}