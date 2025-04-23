class Oval2D {
    static shaderProgram = -1;
    static aPositionShader = -1;
    static aColorShader = -1;

    vertexPositions = [];
    vertexColors = [];
    positionBuffer = null;
    colorBuffer = null;

    static initialize() {
        Oval2D.shaderProgram = initShaders(gl, "./vshader.glsl", "./fshader.glsl");

        if (!Oval2D.shaderProgram) {
            console.error("Failed to initialize shaders.");
            return;
        }

        Oval2D.aPositionShader = gl.getAttribLocation(Oval2D.shaderProgram, "aPosition");
        Oval2D.aColorShader = gl.getAttribLocation(Oval2D.shaderProgram, "aColor");

        if (Oval2D.aPositionShader === -1 || Oval2D.aColorShader === -1) {
            console.error("Failed to get shader attribute locations.");
        }
    }

    constructor(x, y, radiusX, radiusY, color, segments, rotation = 0) {

        this.x = x;
        this.y = y;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.color = color;
        this.segments = segments;
        this.rotation = rotation;

        this.updateVertices();

        if (Oval2D.shaderProgram === -1) {
            Oval2D.initialize();
        }
    }
    
    updateVertices() {
        this.vertexPositions = [vec2(this.x, this.y)];
        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * 2 * Math.PI;
            const rotatedAngle = angle + this.rotation;
            const px = this.x + this.radiusX * Math.cos(rotatedAngle);
            const py = this.y + this.radiusY * Math.sin(rotatedAngle);
            this.vertexPositions.push(vec2(px, py));
        }
        this.vertexColors = Array(this.vertexPositions.length).fill(this.color);
    }

    rotate90Degrees() {
        this.rotation += Math.PI / 2;
        console.log('Rotation:', this.rotation);
        this.updateVertices();
        this.bufferDataToGPU();
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
        gl.useProgram(Oval2D.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(Oval2D.aPositionShader, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(Oval2D.aPositionShader);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(Oval2D.aColorShader, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(Oval2D.aColorShader);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertexPositions.length);

        gl.disableVertexAttribArray(Oval2D.aPositionShader);
        gl.disableVertexAttribArray(Oval2D.aColorShader);

        if (!gl.getProgramParameter(Oval2D.shaderProgram, gl.LINK_STATUS)) {
            console.error('Shader program failed to link:', gl.getProgramInfoLog(Oval2D.shaderProgram));
        }
    }
}