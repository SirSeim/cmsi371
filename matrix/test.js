/*
 * Unit tests for our vector object.
 */
$(function () {

    QUnit.test("hello test", function (assert) {
        assert.ok(1 == "1", "Passed!");
    });

    QUnit.test("identity matrix", function (assert) {
        var identity = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(new Matrix().matrix, identity, "Constructed identity matrix");
    });

    QUnit.test("construct mew matrix", function (assert) {
        var matrix = [
            [2, 4, 5, 6, 7],
            [7, 4, 5, 2, 4],
            [5, 3, 6, 7, 1]
        ];
        assert.deepEqual(new Matrix(matrix.slice()).matrix, matrix, "Constructed custom matrix");
    });

    QUnit.test("get column", function (assert) {
        var matrix = new Matrix([
            [1, 3],
            [4, 2]
        ]);
        assert.deepEqual(matrix.column(0), [1, 4], "got first column");
        assert.deepEqual(matrix.column(1), [3, 2], "got second column");
    });

    QUnit.test("get row", function (assert) {
        var matrix = new Matrix([
            [1, 3],
            [4, 2]
        ]);
        assert.deepEqual(matrix.row(0), [1, 3], "got first row");
        assert.deepEqual(matrix.row(1), [4, 2], "got second row");
    });

    QUnit.test("multiply matrices", function (assert) {
        var first = new Matrix([
            [1, 3],
            [4, 2]
        ]);
        var second = new Matrix([
            [3, 2],
            [4, 6]
        ]);
        var expected = [
            [15, 20],
            [20, 20]
        ];

        assert.deepEqual(first.multiply(second).matrix, expected, "Multiplied matricies");
    });

    QUnit.test("get default Translation Matrix", function (assert) {
        var matrix = Matrix.translateMatrix();
        assert.deepEqual(matrix.matrix, new Matrix().matrix, "created default Translation Matrix");
    });

    QUnit.test("get custom Translation Matrix", function (assert) {
        var matrix = Matrix.translateMatrix(3,5,2);
        var expected = [
            [1, 0, 0, 3],
            [0, 1, 0, 5],
            [0, 0, 1, 2],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(matrix.matrix, expected, "created custom Translation Matrix");
    });

    QUnit.test("get default Scale Matrix", function (assert) {
        var matrix = Matrix.scaleMatrix();
        assert.deepEqual(matrix.matrix, new Matrix().matrix, "created default Scale Matrix");
    });

    QUnit.test("get custom Scale Matrix", function (assert) {
        var matrix = Matrix.scaleMatrix(3,5,2);
        var expected = [
            [3, 0, 0, 0],
            [0, 5, 0, 0],
            [0, 0, 2, 0],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(matrix.matrix, expected, "created custom Scale Matrix");
    });

    QUnit.test("get one Rotation Matrix", function (assert) {
        var expected = [
            [0.9984971498638638, 0, -0.054803665148789524, 0],
            [0, 1, 0, 0],
            [0.054803665148789524, 0, 0.9984971498638638, 0],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(Matrix.rotationMatrix(Math.PI,0,1,0).matrix, expected, "created one Rotation Matrix");
    });

    QUnit.test("get second Rotation Matrix", function (assert) {
        var expected = [
            [0.9990696642014395, 0.009172032044628568, -0.042138817028900925, 0],
            [-0.007740746200689371, 0.9993917035163259, 0.03400446722112828, 0],
            [0.04242507419768877, -0.03364664576014348, 0.9985329320099623, 0],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(Matrix.rotationMatrix(Math.PI,4,5,1).matrix, expected, "created second Rotation Matrix");
    });

    QUnit.test("get default Orthographic Projection Matrix", function (assert) {
        var expected = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(Matrix.orthoMatrix(0,0,0,0,0,0).matrix, expected, "created default Orthographic Projection Matrix");
    });

    QUnit.test("get custom Orthographic Projection Matrix", function (assert) {
        var expected = [
            [-1, 0, 0, 3],
            [0, 2, 0, -11],
            [0, 0, -0.2857142857142857, -1.2857142857142858],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(Matrix.orthoMatrix(4,2,6,5,1,8).matrix, expected, "created custom Orthographic Projection Matrix");
    });

    QUnit.test("get default Perspective Projection Matrix", function (assert) {
        var expected = [
            [-1, 0, 0, 0],
            [0, -1, 0, 0],
            [0, 0, 0, 1],
            [0, 0, -1, 0]
        ];
        assert.deepEqual(Matrix.perspMatrix(0,0,0,0,0,0).matrix, expected, "created default Perspective Projection Matrix");
    });

    QUnit.test("get custom Perspective Projection Matrix", function (assert) {
        var expected = [
            [-1, 0, -3, 0],
            [0, 2, 11, 0],
            [0, 0, -1.2857142857142858, -2.2857142857142856],
            [0, 0, -1, 0]
        ];
        assert.deepEqual(Matrix.perspMatrix(4,2,6,5,1,8).matrix, expected, "created custom Perspective Projection Matrix");
    });

    QUnit.test("convert matrix to gl compatible array", function (assert) {
        var expected = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        assert.deepEqual(new Matrix().toGL(), expected, "converted identity matrix");

        var testMatrix = new Matrix([
            [1, 0, 0, 3],
            [0, 1, 0, 5],
            [0, 0, 1, 2],
            [0, 0, 0, 1]
        ]);
        var expected = new Float32Array([
            1, 0, 0, 3,
            0, 1, 0, 5,
            0, 0, 1, 2,
            0, 0, 0, 1
        ]);
        assert.deepEqual(testMatrix.toGL(), expected, "converted custom matrix")
    });
});
