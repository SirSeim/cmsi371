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
});
