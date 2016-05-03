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
    var movingActive = false;
    var currentRotation = 0.0;
    var currentInterval;
    var modelViewMatrix;
    var projectionMatrix;
    var vertexPosition;
    var vertexColor;

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
        MatrixClass: Matrix,
        VectorClass: Vector
    };


    shape = new Shape(ShapesLibrary.sphere({
            color: { r: 0.0, g: 1.0, b: 0.0 },
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 0.5,
            mode: "TRIANGLES"
            // axis: { x: 1.0, y: 0.0, z: 0.0 }
        }, 1.4, 15, 15), library)
    .addChild(
        new Shape(ShapesLibrary.cube({
            color: { r: 0.0, g: 0.0, b: 1.0 },
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 50,
            mode: "TRIANGLES"
        }), library).scale(3,1,3).rotate(180, 0,1,0)
    )
    .addChild(
        new Shape(ShapesLibrary.faultyPyramid({
            color: { r: 1.0, g: 0.5, b: 0.5 },
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 50,
            mode: "TRIANGLES"
        }), library).translate(-0.25,0.75,0.25).rotate(90,1,0,0).scale(2,2,2)
    )
    .addChild(
        new Shape(ShapesLibrary.faultyPyramid({
            color: { r: 1.0, g: 0.5, b: 0.5 },
            specularColor: { r: 1.0, g: 1.0, b: 1.0 },
            shininess: 50,
            mode: "TRIANGLES"
        }),library).translate(-0.25,0.75,0.25).rotate(-270,1,0,0).scale(2,2,-2)
    );

    shape.prepare();

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
    var vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    var vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    var vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    var normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    // Finally, we come to the typical setup for transformation matrices:
    // model-view and projection, managed separately.
    var modelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    var xRotationMatrix = gl.getUniformLocation(shaderProgram, "xRotationMatrix");
    var yRotationMatrix = gl.getUniformLocation(shaderProgram, "yRotationMatrix");
    var projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    var cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

    // Note the additional variables.
    var lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    var lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    var lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    var shininess = gl.getUniformLocation(shaderProgram, "shininess");

    /*
     * Displays the scene.
     */
    drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Display the objects.
        shape.save();
        // if (shape.axis) {

        //     shape.rotate(currentRotation, shape.axis.x, shape.axis.y, shape.axis.z);
        // }

        shape.draw(vertexDiffuseColor, vertexSpecularColor, shininess, modelViewMatrix, normalVector, vertexPosition);
        shape.restore();

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

    var cMatrix = Matrix.cameraMatrix(
        1, -1, 0, 0, 0, 0, 0, 0, 1
    );
    gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, cMatrix.toGL());

    var LAngle = 0;
    var rotationAroundX = 0.0;
    var rotationAroundY = 0.0;
    var rotationlight = function (angle) {
        return [Math.sin(angle), 1, Math.cos(angle), 1];
    };

    // Set up our one light source and its colors.
    gl.uniform4fv(lightPosition, rotationlight(LAngle));
    gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
    gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);

    // Animation initialization/support.
    previousTimestamp = null;
    advanceScene = function (timestamp) {
        // Check if the user has turned things off.
        if (!animationActive && !movingActive) {
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
        if (animationActive) {
            LAngle += 0.05;
            currentRotation += 0.033 * progress;
            if (currentRotation >= 360.0) {
                currentRotation -= 360.0;
            }
        }
        
        var lookon = cMatrix.multiply(Matrix.rotationMatrix(rotationAroundX, 1,0,0));
        lookon = lookon.multiply(Matrix.rotationMatrix(rotationAroundY, 0,1,0));
        gl.uniformMatrix4fv(cameraMatrix, gl.FALSE, lookon.toGL());


        // Set up our one light source and its colors.
        gl.uniform4fv(lightPosition, rotationlight(LAngle));
        gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
        gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);

        drawScene();
        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    // Draw the initial scene.
    drawScene();

    /*
     * Performs rotation calculations.
     */
    var rotateScene = function (event) {
        rotationAroundX = xRotationStart - yDragStart + event.clientY;
        rotationAroundY = yRotationStart - xDragStart + event.clientX;
        window.requestAnimationFrame(advanceScene);
    };

    $('#animate').click(function () {
        var active = $(this).data('active');
        if (active === "true") {
            animationActive = false;
            $(this).data('active', "false").text("Animate");
        } else {
            animationActive = true;
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
            $(this).data('active', "true").text("Stop Animation");
        }
    });

    // Instead of animation, we do interaction: let the mouse control rotation.
    var xDragStart;
    var yDragStart;
    var xRotationStart;
    var yRotationStart;
    $(canvas).mousedown(function (event) {
        movingActive = true;
        xDragStart = event.clientX;
        yDragStart = event.clientY;
        xRotationStart = rotationAroundX;
        yRotationStart = rotationAroundY;
        $(canvas).mousemove(rotateScene);
    }).mouseup(function (event) {
        movingActive = false;
        $(canvas).unbind("mousemove");
    });

}(document.getElementById("matrices-webgl")));
