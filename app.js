var canvas;
var gl;
var shapes = [];

window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0,0,0, 1.0 );
    gl.clear(gl.COLOR_BUFFER_BIT);

    shapes.push(new Square2D(0, -0.2, 1.2, vec3(1, 1, 1)));
    shapes.push(new Square2D(0, -0.2, 1, vec3(0, 0, 0)));
    shapes.push(new Square2D(0, -0.2, 0.8, vec3(1, 1, 1)));
    shapes.push(new Square2D(0, -0.2, 0.6, vec3(0, 0, 0)));
    shapes.push(new Square2D(0, -0.2, 0.4, vec3(1, 1, 1)));
    shapes.push(new Square2D(0, -0.2, 0.2, vec3(0, 0, 0)));
    redEllipse = new Oval2D(-0.6, 0.7, 0.2, 0.12, vec3(1.0, 0.0, 0.0), 100);
    shapes.push(redEllipse);
    shapes.push(new Circle2D(0.6, 0.7, 0.2, 100));
    shapes.push(new Triangle2D(0, 0.78, 0.5));

    for (let shape of shapes) {
        shape.bufferDataToGPU();
    }

    document.getElementById("rotateEllipse").addEventListener("click", function() {
        console.log("Rotating ellipse");
        redEllipse.rotate90Degrees();
        redEllipse.updateVertices();
        redEllipse.bufferDataToGPU();
        render();
    });
    
    render();
};

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT );   

    for (let shape of shapes) {
        shape.draw();
    }
}


