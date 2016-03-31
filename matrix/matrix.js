var Matrix = function (matrix) {
    if (!matrix) {
        this.matrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
    } else {
        this.matrix = matrix;
    }
};

Matrix.prototype.column = function (num) {
    var result = [];
    for (var i = 0; i < this.matrix.length; i++) {
        result.push(this.matrix[i][num]);
    }
    return result;
};
Matrix.prototype.row = function (num) {
    var result = [];
    for (var i = 0; i < this.matrix[num].length; i++) {
        result.push(this.matrix[num][i]);
    }
    return result;
};

Matrix.prototype.multiply = function (other) {
    var partialProduct = [];
    for (var row = 0; row < this.matrix[0].length; row++) {
        for (var column = 0; column < this.matrix.length; column++) {
            var dotProduct = 0;
            var currRow = this.row(row);
            var currCol = other.column(column);
            for (var i = 0; i < currRow.length; i++) {
                dotProduct += currRow[i]*currCol[i];
            }
            partialProduct.push(dotProduct);
        }
    }

    var width = this.row(0).length;
    var height = this.column(0).length;
    var result = [];
    for (var row = 0; row < height; row++) {
        var newRow = [];
        for (var col = 0; col < width; col++) {
            newRow[col] = partialProduct.shift();
        }
        result.push(newRow);
    }

    return new Matrix(result);
};

Matrix.translateMatrix = function (x, y, z) {
    x = x || 0;
    y = y || 0;
    z = z || 0;
    return new Matrix([
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1]
    ]);
};

Matrix.scaleMatrix = function (x, y, z) {
    x = x || 1;
    y = y || 1;
    z = z || 1;
    return new Matrix([
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1]
    ]);
};

Matrix.rotationMatrix = function (angle, x, y, z) {
    // In production code, this function should be associated
    // with a matrix object with associated functions.
    var axisLength = Math.sqrt((x * x) + (y * y) + (z * z));
    var s = Math.sin(angle * Math.PI / 180.0);
    var c = Math.cos(angle * Math.PI / 180.0);
    var oneMinusC = 1.0 - c;

    // Normalize the axis vector of rotation.
    x /= axisLength;
    y /= axisLength;
    z /= axisLength;

    // Now we can calculate the other terms.
    // "2" for "squared."
    var x2 = x * x;
    var y2 = y * y;
    var z2 = z * z;
    var xy = x * y;
    var yz = y * z;
    var xz = x * z;
    var xs = x * s;
    var ys = y * s;
    var zs = z * s;

    // GL expects its matrices in column major order.
    return new Matrix([
        [
            (x2 * oneMinusC) + c,
            (xy * oneMinusC) + zs,
            (xz * oneMinusC) - ys,
            0.0
        ],

        [
            (xy * oneMinusC) - zs,
            (y2 * oneMinusC) + c,
            (yz * oneMinusC) + xs,
            0.0
        ],

        [
            (xz * oneMinusC) + ys,
            (yz * oneMinusC) - xs,
            (z2 * oneMinusC) + c,
            0.0
        ],

        [
            0.0,
            0.0,
            0.0,
            1.0
        ]
    ]);
};
