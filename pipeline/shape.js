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
        this.specularColor = spec.specularColor;
        this.specularColors = spec.specularColors;
        this.shininess = spec.shininess;
        this.gl = libraries.gl;
        this.mode = spec.mode || "TRIANGLES";
        this.GLSLUtilities = libraries.GLSLUtilities;
        this.MatrixClass = libraries.MatrixClass;
        this.VectorClass = libraries.VectorClass;
        // this.transform = new this.MatrixClass();
        this.transform = {
            translate: {x:0.0, y:0.0, z:0.0},
            rotate: {angle:0.0, x:0.0, y:0.0, z:0.0},
            scale: {x:1.0, y:1.0, z:1.0}
        }
        this.history = [];

        // if (this.mode == "TRIANGLES") {
        //     this.glmode = this.gl.TRIANGLES;
        //     this.size = this.toRawTriangleArray().length;
        // } else if (this.mode == "LINES") {
        //     this.glmode = this.gl.LINES;
        //     this.size = this.toRawLineArray().length;
        // }
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

    Shape.prototype.toNormalArray = function () {
        var result = [];

        // For each face...
        for (var i = 0, maxi = this.indices.length; i < maxi; i += 1) {
            // We form vectors from the first and second then second and third vertices.
            var p0 = this.vertices[this.indices[i][0]];
            var p1 = this.vertices[this.indices[i][1]];
            var p2 = this.vertices[this.indices[i][2]];

            // Technically, the first value is not a vector, but v can stand for vertex
            // anyway, so...
            var v0 = new this.VectorClass(p0[0], p0[1], p0[2]);
            var v1 = new this.VectorClass(p1[0], p1[1], p1[2]).subtract(v0);
            var v2 = new this.VectorClass(p2[0], p2[1], p2[2]).subtract(v0);
            var normal = v1.cross(v2).unit();

            // We then use this same normal for every vertex in this face.
            for (var j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    };

    Shape.prototype.toVertexNormalArray = function () {
        var result = [];

        // For each face...
        for (var i = 0, maxi = this.indices.length; i < maxi; i += 1) {
            // For each vertex in that face...
            for (var j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                var p = this.vertices[this.indices[i][j]];
                var normal = new this.VectorClass(p[0], p[1], p[2]).unit();
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
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

    Shape.prototype.toSpecularTriangleArray = function () {
        if (!this.specularColor) {
            this.specularColor = { r: 0.1, g: 0.1, b: 0.1 };
        }
        if (!this.specularColors) {
            // If we have a single specularColor, we expand that into an array
            // of the same specularColor over and over.
            var specularColors = [];
            for (var i = 0, maxi = this.toRawTriangleArray().length / 3;
                    i < maxi; i++) {
                specularColors = specularColors.concat(
                    this.specularColor.r,
                    this.specularColor.g,
                    this.specularColor.b
                );
            }
            return specularColors;
        }

        var specularColors = [];
        for (var i = 0, maxi = this.toRawTriangleArray().length / 3; i < maxi; i++) {
            
        }
        return this.specularColors;
    }

    Shape.prototype.toSpecularLineArray = function () {
        if (!this.specularColor) {
            this.specularColor = { r: 0.1, g: 0.1, b: 0.1 };
        }
        if (!this.specularColors) {
            // If we have a single specularColor, we expand that into an array
            // of the same specularColor over and over.
            var specularColors = [];
            for (var i = 0, maxi = this.toRawLineArray().length / 3;
                    i < maxi; i++) {
                specularColors = specularColors.concat(
                    this.specularColor.r,
                    this.specularColor.g,
                    this.specularColor.b
                );
            }
            return specularColors;
        }

        var specularColors = [];
        for (var i = 0, maxi = this.toRawLineArray().length / 3; i < maxi; i++) {
            
        }
        return this.specularColors;
    };

    Shape.prototype.prepare = function () {
        if (this.mode == "TRIANGLES") {
            var vertices = this.toRawTriangleArray();
            var colors = this.toColorTriangleArray();
            var specularColors = this.toSpecularTriangleArray();
            var normals = this.toNormalArray();
            this.glmode = this.gl.TRIANGLES;
            this.size = this.toRawTriangleArray().length;
        } else if (this.mode == "LINES") {
            var vertices = this.toRawLineArray();
            var colors = this.toColorLineArray();
            var specularColors = this.toSpecularLineArray();
            var normals = this.toVertexNormalArray();
            this.glmode = this.gl.LINES;
            this.size = this.toRawLineArray().length;
        } else {
            console.error("no implemented draw mode found");
            return
        }

        console.log(this.size);
        console.log(vertices.length);
        console.log(specularColors.length);
        console.log(normals.length);

        this.buffer = this.GLSLUtilities.initVertexBuffer(this.gl, vertices);
        this.colorBuffer = this.GLSLUtilities.initVertexBuffer(this.gl, colors);
        this.specularBuffer = this.GLSLUtilities.initVertexBuffer(this.gl, specularColors);
        this.normalBuffer = GLSLUtilities.initVertexBuffer(this.gl, normals);

        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].prepare();
            }
        }
        return this;
    };

    Shape.prototype.addChild = function (shape) {
        if (!this.children) {
            this.children = [].concat(shape);
        } else {
            this.children = this.children.concat(shape);
        }
        return this;
    };

    Shape.prototype.removeChild = function (shape) {
        if (!shape) {
            this.children.pop();
        } else {
            this.children.splice(this.children.indexOf(shape), 1);
        }
        return this;
    };

    Shape.prototype.translate = function (x, y, z) {
        this.transform.translate.x += x;
        this.transform.translate.y += y;
        this.transform.translate.z += z;

        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].translate(x, y, z);
            }
        }
        return this;
    };

    Shape.prototype.scale = function (x, y, z) {
        this.transform.scale.x *= x;
        this.transform.scale.y *= y;
        this.transform.scale.z *= z;

        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].scale(x, y, z);
            }
        }
        return this;
    };

    Shape.prototype.rotate = function (angle, x, y, z) {
        this.transform.rotate.angle += angle;
        this.transform.rotate.x += x;
        this.transform.rotate.y += y;
        this.transform.rotate.z += z;

        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].rotate(angle, x, y, z);
            }
        }
        return this;
    };

    var cloneTransform = function (obj) {
        return {
            translate: {x:obj.translate.x, y:obj.translate.y, z:obj.translate.z},
            rotate: {angle:obj.rotate.angle, x:obj.rotate.x, y:obj.rotate.y, z:obj.rotate.z},
            scale: {x:obj.scale.x, y:obj.scale.y, z:obj.scale.z}
        };
    }

    Shape.prototype.save = function () {
        this.history.push(cloneTransform(this.transform));

        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].save();
            }
        }
        return this;
    };

    Shape.prototype.restore = function () {
        this.transform = this.history.pop();

        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].restore();
            }
        }
        return this;
    };

    Shape.prototype.draw = function (vertexDiffuseColor, vertexSpecularColor, shininess, modelViewMatrix, normalVector, vertexPosition) {
        // Set the varying colors.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(vertexDiffuseColor, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.specularBuffer);
        this.gl.vertexAttribPointer(vertexSpecularColor, 3, this.gl.FLOAT, false, 0, 0);

        // Set the shininess.
        this.gl.uniform1f(shininess, this.shininess);

        // Set up the model-view matrix, if an axis is included.  If not, we
        // specify the identity matrix.
        var translate = this.MatrixClass.translateMatrix(this.transform.translate.x, this.transform.translate.y, this.transform.translate.z);
        var rotate = this.MatrixClass.rotationMatrix(this.transform.rotate.angle, this.transform.rotate.x, this.transform.rotate.y, this.transform.rotate.z);
        var scale = this.MatrixClass.scaleMatrix(this.transform.scale.x, this.transform.scale.y, this.transform.scale.z);
        var product = scale.multiply(rotate).multiply(translate);
        // console.log(product);

        console.log((new this.MatrixClass()).toGL());
        this.gl.uniformMatrix4fv(modelViewMatrix, this.gl.FALSE, (new this.MatrixClass()).toGL());
        // this.gl.uniformMatrix4fv(modelViewMatrix, this.gl.FALSE, product.toGL());

        // Set the varying normal vectors.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.vertexAttribPointer(normalVector, 3, this.gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.vertexAttribPointer(vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.glmode, 0, this.size / 3);

        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].draw(vertexDiffuseColor, vertexSpecularColor, shininess, modelViewMatrix, normalVector, vertexPosition);
            }
        }

        // console.log(this.axis);
        return this;
    };



    var ICOX = 0.525731112119133606,
        ICOZ = 0.850650808352039932;
    ShapesLibrary.icosahedron = function (addSpec) {
        addSpec = addSpec || {};
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
        addSpec = addSpec || {};
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
        addSpec = addSpec || {};
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

    ShapesLibrary.faultyPyramid = function (addSpec) {
        addSpec = addSpec || {};
        addSpec.vertices = [
            [ 0.0, 0.0, 0.0 ],
            [ 0.5, 0.0, 0.0 ],
            [ 0.0, 0.0, -0.5 ],
            [ 0.5, 0.0, -0.5 ],
            [ 0.0, 0.5, 0.0 ]
        ];
        addSpec.indices = [
            [ 0, 1, 3 ],
            [ 0, 2, 3 ],
            [ 4, 0, 1 ],
            [ 4, 1, 3 ],
            [ 4, 3, 2 ],
            [ 4, 2, 0 ]
        ];
        return addSpec;
    };

    ShapesLibrary.pyramid = function (addSpec) {
        addSpec = addSpec || {};
        addSpec.vertices = [
            [ -0.25, 0.0, 0.25 ],
            [ 0.25, 0.0, 0.25 ],
            [ -0.25, 0.0, -0.25 ],
            [ 0.25, 0.0, -0.25 ],
            [ 0.0, 0.5, 0.0 ]
        ];
        addSpec.indices = [
            [ 0, 1, 3 ],
            [ 0, 2, 3 ],
            [ 4, 0, 1 ],
            [ 4, 1, 3 ],
            [ 4, 3, 2 ],
            [ 4, 2, 0 ]
        ];
        return addSpec;
    };

}());
