/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    // Because many of these variables are best initialized then immediately
    // used in context, we merely name them here.  Read on to see how they
    // are used.
    var gl; // The WebGL context.

    // This variable stores 3D model information.
    var objectsToDraw;

    // The shader program to use.
    var shaderProgram;

    // Utility variable indicating whether some fatal has occurred.
    var abort = false;

    // Important state variables.
    var animationActive = false;
    var currentRotation = 0.0;
    var currentInterval;
    var modelViewMatrix;
    var projectionMatrix;
    var vertexPosition;
    var vertexColor;

    // An individual "draw object" function.
    var drawObject;

    // The big "draw scene" function.
    var drawScene;

    // State and function for performing animation.
    var previousTimestamp;
    var advanceScene;

    // Reusable loop variables.
    var i;
    var maxi;
    var j;
    var maxj;

    // Grab the WebGL rendering context.
    gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    var library = {
        gl: gl,
        GLSLUtilities: GLSLUtilities,
        MatrixClass: Matrix
    };

    // var icosahedron = new Shape(ShapesLibrary.icosahedron({mode:"LINES"}), library);
    // var cube = new Shape(ShapesLibrary.cube({mode:"TRIANGLES"}), library);
    // var sphere = new Shape(ShapesLibrary.sphere({mode:"LINES"}, false, 25, 25), library);

    // Build the objects to display.  Note how each object may come with a
    // rotation axis now.
    objectsToDraw = [
        // We move our original triangles a bit to accommodate a new addition
        // to the scene (yes, a translation will also do the trick, if it
        // where implemented in this program).
        // new Shape({
        //     mode: "TRIANGLES",
        //     vertices: [
        //         [ -2.0, 0.0, 0.0 ],
        //         [ -1.5, 0.0, -0.75 ],
        //         [ -2.0, 0.5, 0.0 ]
        //     ],
        //     indices: [
        //         [ 0, 1, 2 ]
        //     ],
        //     colors: [
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 0.0, 1.0 ]
        //     ],
        // }, library),
        // new Shape({
        //     mode: "TRIANGLES",
        //     vertices: [].concat(
        //         [ -1.75, 0.0, -0.5 ],
        //         [ -1.25, 0.0, -0.5 ],
        //         [ -1.75, 0.5, -0.5 ]
        //     ),
        //     indices: [].concat(
        //         [ 0, 1, 2 ]
        //     ),
        //     color: { r: 0.0, g: 1.0, b: 0 }
        // }, library),
        // new Shape({
        //     mode: "TRIANGLES",
        //     vertices: [].concat(
        //         [ -2.25, 0.0, 0.5 ],
        //         [ -1.75, 0.0, 0.5 ],
        //         [ -2.25, 0.5, 0.5 ]
        //     ),
        //     indices: [].concat(
        //         [ 0, 1, 2 ]
        //     ),
        //     color: { r: 0.0, g: 0.0, b: 1.0 }
        // }, library),
        // new Shape(ShapesLibrary.icosahedron({
        //     color: { r: 0.0, g: 0.5, b: 0.0 },
        //     mode:"LINES",
        //     axis: { x: 0.0, y: 1.0, z: 1.0 }
        // }), library),
        new Shape(ShapesLibrary.sphere({
            color: { r: 0.0, g: 1.0, b: 0.0 },
            mode: "LINES",
            axis: { x: 1.0, y: 1.0, z: 1.0 }
        }, 1.4, 10, 10), library).addChild(
            new Shape(ShapesLibrary.cube({
                color: { r: 0.0, g: 0.0, b: 1.0 },
                mode: "LINES",
            }), library)
        ),
        new Shape(ShapesLibrary.faultyPyramid({
            color: { r: 1.0, g: 0.0, b: 0.0 },
            mode: "TRIANGLES",
            axis: { x: 1.0, y: 1.0, z: 0.0 }
        }), library).scale(1.0,-2.0,1.0),
        new Shape(ShapesLibrary.pyramid({
            color: { r: 1.0, g: 1.0, b: 0.0 },
            mode: "TRIANGLES",
            axis: { x: 1.0, y: 1.0, z: 0.0 }
        }), library).scale(3.0,3.0,3.0),
        new Shape({
            vertices: [
                [ 3.0, 1.5, 0.0 ],
                [ 2.0, -1.5, 0.0 ],
                [ 4.0, -1.5, 0.0 ]
            ],
            indices: [
                [ 0, 1, 2 ]
            ],
            // colors: [
            //     [ 1.0, 0.5, 0.0 ],
            //     [ 0.0, 0.0, 0.5 ],
            //     [ 0.5, 0.75, 0.5 ]
            // ],
            color: { r: 1.0, g: 1.0, b: 0.0 },
            mode: "TRIANGLES",
            axis: { x: -0.5, y: 1.0, z: 0.0 }
        }, library),
    ];

    for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
        objectsToDraw[i].prepare();
    }

    // Initialize the shaders.
    shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(vertexColor);

    // Finally, we come to the typical setup for transformation matrices:
    // model-view and projection, managed separately.
    modelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");

    /*
     * Displays the scene.
     */
    drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Display the objects.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            // drawObject(objectsToDraw[i]);
            objectsToDraw[i].save();
            if (objectsToDraw[i].axis) {

                objectsToDraw[i].rotate(currentRotation, objectsToDraw[i].axis.x, objectsToDraw[i].axis.y, objectsToDraw[i].axis.z);
                // console.log("rotating");
            }
            objectsToDraw[i].draw(vertexColor, modelViewMatrix, vertexPosition);
            objectsToDraw[i].restore();
        }

        // All done.
        gl.flush();
    };

    // Because our canvas element will not change size (in this program),
    // we can set up the projection matrix once, and leave it at that.
    // Note how this finally allows us to "see" a greater coordinate range.
    // We keep the vertical range fixed, but change the horizontal range
    // according to the aspect ratio of the canvas.  We can also expand
    // the z range now.
    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE, Matrix.orthoMatrix(
        -2 * (canvas.width / canvas.height),
        2 * (canvas.width / canvas.height),
        -2,
        2,
        -10,
        10
    ).toGL());

    // Animation initialization/support.
    previousTimestamp = null;
    advanceScene = function (timestamp) {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }

        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // Check if it's time to advance.
        var progress = timestamp - previousTimestamp;
        if (progress < 30) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // All clear.
        currentRotation += 0.033 * progress;
        drawScene();
        if (currentRotation >= 360.0) {
            currentRotation -= 360.0;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(function () {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

}(document.getElementById("matrices-webgl")));
