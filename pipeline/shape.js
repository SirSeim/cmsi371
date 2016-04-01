(function() {
    window.ShapesLibrary = window.ShapesLibrary || {};
    window.Shape = window.Shape || {};

    // one color per indice if using colors
    Shape = function (spec, libraries) {
        this.vertices = spec.vertices;
        this.indices = spec.indices;
        this.color = spec.color;
        this.colors = spec.colors;
        this.axis = spec.axis;
        this.gl = libraries.gl;
        this.mode = spec.mode || "TRIANGLES";
        this.GLSLUtilities = libraries.GLSLUtilities;
        this.MatrixClass = libraries.MatrixClass;
        this.transform = new this.MatrixClass();
        this.history = [];

        if (this.mode == "TRIANGLES") {
            this.glmode = this.gl.TRIANGLES;
            this.size = this.toRawTriangleArray().length;
        } else if (this.mode == "LINES") {
            this.glmode = this.gl.LINES;
            this.size = this.toRawLineArray().length;
        }
    };

    Shape.prototype.toRawTriangleArray = function () {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = this.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    this.vertices[
                        this.indices[i][j]
                    ]
                );
            }
        }

        return result;
    };

    Shape.prototype.toRawLineArray = function () {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = this.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    this.vertices[
                        this.indices[i][j]
                    ],

                    this.vertices[
                        this.indices[i][(j + 1) % maxj]
                    ]
                );
            }
        }

        return result;
    };

    // Still needs a lot of work
    Shape.prototype.toColorTriangleArray = function () {
        if (!this.color) {
            this.color = { r: 0.1, g: 0.1, b: 0.1 };
        }
        if (!this.colors) {
            // If we have a single color, we expand that into an array
            // of the same color over and over.
            var colors = [];
            for (var i = 0, maxi = this.toRawTriangleArray().length / 3;
                    i < maxi; i++) {
                colors = colors.concat(
                    this.color.r,
                    this.color.g,
                    this.color.b
                );
            }
            return colors;
        }

        var colors = [];
        for (var i = 0, maxi = this.toRawTriangleArray().length / 3; i < maxi; i++) {
            
        }
        return this.colors;
    };

    // Still needs a lot of work
    Shape.prototype.toColorLineArray = function () {
        if (!this.color) {
            this.color = { r: 0.1, g: 0.1, b: 0.1 };
        }
        if (!this.colors) {
            // If we have a single color, we expand that into an array
            // of the same color over and over.
            var colors = [];
            for (var i = 0, maxi = this.toRawLineArray().length / 3;
                    i < maxi; i++) {
                colors = colors.concat(
                    this.color.r,
                    this.color.g,
                    this.color.b
                );
            }
            return colors;
        }

        var colors = [];
        for (var i = 0, maxi = this.toRawLineArray().length / 3; i < maxi; i++) {
            
        }
        return this.colors;
    };

    Shape.prototype.prepare = function () {
        if (this.mode == "TRIANGLES") {
            var vertices = this.toRawTriangleArray();
            var colors = this.toColorTriangleArray();
        } else if (this.mode == "LINES") {
            var vertices = this.toRawLineArray();
            var colors = this.toColorLineArray();
        } else {
            console.error("no implemented draw mode found");
            return
        }
        this.buffer = this.GLSLUtilities.initVertexBuffer(this.gl, vertices);
        this.colorBuffer = this.GLSLUtilities.initVertexBuffer(this.gl, colors);
    };

    Shape.prototype.addChild = function (shape) {
        if (!this.children) {
            this.children = [].concat(shape);
        } else {
            this.children = this.children.concat(shape);
        }
        return this.children.length - 1;
    };

    Shape.prototype.removeChild = function (shape) {
        if (!shape) {
            this.children.pop();
        } else {
            this.children.splice(this.children.indexOf(shape), 1);
        }
    };

    Shape.prototype.translate = function (x, y, z) {
        var translate = this.MatrixClass.translateMatrix(x, y, z);
        this.transform = this.transform.multiply(translate);
    };

    Shape.prototype.scale = function (x, y, z) {
        var scale = this.MatrixClass.scaleMatrix(x, y, z);
        this.transform = this.transform.multiply(scale);
    };

    Shape.prototype.rotate = function (angle, x, y, z) {
        var rotation = this.MatrixClass.rotationMatrix(angle, x, y, z);
        this.transform = this.transform.multiply(rotation);
    };

    Shape.prototype.save = function () {
        this.history.push(new this.MatrixClass(this.transform.matrix));
    };

    Shape.prototype.restore = function () {
        this.transform = this.history.pop();
    };

    Shape.prototype.draw = function (vertexColor, modelViewMatrix, vertexPosition) {
        // console.log("starting");
        // this.prepare();

        // Set the varying colors.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(vertexColor, 3, this.gl.FLOAT, false, 0, 0);

        // Set up the model-view matrix, if an axis is included.  If not, we
        // specify the identity matrix.
        this.gl.uniformMatrix4fv(modelViewMatrix, this.gl.FALSE, this.transform.toGL());

        // console.log("running " + this.mode);
        
        // Set the varying vertex coordinates.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.vertexAttribPointer(vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.glmode, 0, this.size / 3);
        // console.log("done");
    };



    var ICOX = 0.525731112119133606,
        ICOZ = 0.850650808352039932;
    ShapesLibrary.icosahedron = function (addSpec) {
        addSpec.vertices = [
            [ -ICOX, 0.0, ICOZ ],
            [ ICOX, 0.0, ICOZ ],
            [ -ICOX, 0.0, -ICOZ ],
            [ ICOX, 0.0, -ICOZ ],
            [ 0.0, ICOZ, ICOX ],
            [ 0.0, ICOZ, -ICOX ],
            [ 0.0, -ICOZ, ICOX ],
            [ 0.0, -ICOZ, -ICOX ],
            [ ICOZ, ICOX, 0.0 ],
            [ -ICOZ, ICOX, 0.0 ],
            [ ICOZ, -ICOX, 0.0 ],
            [ -ICOZ, -ICOX, 0.0 ]
        ];
        addSpec.indices = [
            [ 1, 4, 0 ],
            [ 4, 9, 0 ],
            [ 4, 5, 9 ],
            [ 8, 5, 4 ],
            [ 1, 8, 4 ],
            [ 1, 10, 8 ],
            [ 10, 3, 8 ],
            [ 8, 3, 5 ],
            [ 3, 2, 5 ],
            [ 3, 7, 2 ],
            [ 3, 10, 7 ],
            [ 10, 6, 7 ],
            [ 6, 11, 7 ],
            [ 6, 0, 11 ],
            [ 6, 1, 0 ],
            [ 10, 1, 6 ],
            [ 11, 0, 9 ],
            [ 2, 11, 9 ],
            [ 5, 2, 9 ],
            [ 11, 2, 7 ]
        ];
        return addSpec;
    };

    ShapesLibrary.cube = function (addSpec) {
        addSpec.vertices = [
            [ 0.5, 0.5, 0.5 ],
            [ 0.5, 0.5, -0.5 ],
            [ -0.5, 0.5, -0.5 ],
            [ -0.5, 0.5, 0.5 ],
            [ 0.5, -0.5, 0.5 ],
            [ 0.5, -0.5, -0.5 ],
            [ -0.5, -0.5, -0.5 ],
            [ -0.5, -0.5, 0.5 ]
        ];
        addSpec.indices = [
            [ 0, 1, 3 ],
            [ 2, 3, 1 ],
            [ 0, 3, 4 ],
            [ 7, 4, 3 ],
            [ 0, 4, 1 ],
            [ 5, 1, 4 ],
            [ 1, 5, 6 ],
            [ 2, 1, 6 ],
            [ 2, 7, 3 ],
            [ 6, 7, 2 ],
            [ 4, 7, 6 ],
            [ 5, 4, 6 ]
        ];
        return addSpec;
    };

    ShapesLibrary.sphere = function (addSpec, radius, horizontal, vertical) {
        var vertices = [];
        var indices = [];
        var radius = radius || 0.5;
        var vertical = vertical || 25;
        var horizontal = horizontal || 25;

        for (var i = 0; i < horizontal+1; i++) {
            var h = i * Math.PI / horizontal;
            var sin = Math.sin(h);
            var cos = Math.cos(h);

            for (var j = 0; j < vertical+1; j++) {
                var v = 2 * j * Math.PI / vertical;
                vertices.push([ radius*Math.cos(v)*sin, radius*cos, radius*Math.sin(v)*sin ]);
            }
        }

        for (var i = 0; i < horizontal; i++) {
            for (var j = 0; j < vertical; j++) {
                var top = i * (vertical + 1) + j;
                var bottom = top + vertical + 1;

                indices.push([bottom, bottom + 1, top + 1]);
                indices.push([top, bottom, top + 1]);
            }
        }

        addSpec.vertices = vertices;
        addSpec.indices = indices;
        return addSpec;
    };

}());
