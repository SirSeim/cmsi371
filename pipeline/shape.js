(function() {
    window.ShapesLibrary = window.ShapesLibrary || {};
    window.Shape = window.Shape || {};

    // one color per indice if using colors
    Shape = function (spec) {
        this.vertices = spec.vertices;
        this.indices = spec.indices;
        this.color = spec.color;
        this.colors = spec.colors;
        this.gl = spec.gl;
        this.mode = spec.mode || "TRIANGLES";
        this.GLSLUtilities = spec.GLSLUtilities;
        this.MatrixClass = spec.MatrixClass;
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
        var Matrix = this.MatrixClass;
        this.transform = this.transform || new Matrix();
        var translate = Matrix.translateMatrix(x, y, z);
        this.transform = this.transform.multiply(translate);
    };

    Shape.prototype.scale = function (x, y, z) {
        var Matrix = this.MatrixClass;
        this.transform = this.transform || new Matrix();
        var scale = Matrix.scaleMatrix(x, y, z);
        this.transform = this.transform.multiply(scale);
    };

    Shape.prototype.rotate = function (angle, x, y, z) {
        var Matrix = this.MatrixClass;
        this.transform = this.transform || new Matrix();
        var rotation = Matrix.rotationMatrix(angle, x, y, z);
        this.transform = this.transform.multiply(rotation);
    };

    Shape.prototype.draw = function () {

    };



    var ICOX = 0.525731112119133606,
        ICOZ = 0.850650808352039932;
    ShapesLibrary.icosahedron = function () {
        return {
            vertices: [
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
            ],
            indices: [
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
            ]
        };
    };

    ShapesLibrary.cube = function () {
        return {
            vertices: [
                [ 0.5, 0.5, 0.5 ],
                [ 0.5, 0.5, -0.5 ],
                [ -0.5, 0.5, -0.5 ],
                [ -0.5, 0.5, 0.5 ],
                [ 0.5, -0.5, 0.5 ],
                [ 0.5, -0.5, -0.5 ],
                [ -0.5, -0.5, -0.5 ],
                [ -0.5, -0.5, 0.5 ]
            ],
            indices: [
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
            ]
        };
    };

    ShapesLibrary.sphere = function (radius, horizontal, vertical) {
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

        return {
            vertices: vertices,
            indices: indices
        };
    };

}());
