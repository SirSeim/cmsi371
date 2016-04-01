/*
 * Unit tests for our vector object.
 */
$(function () {

    QUnit.test("hello test", function (assert) {
        assert.ok(1 == "1", "Passed!");
    });

    QUnit.test("construct empty Shape, test toRawTriangleArray", function (assert) {
        var shape = new Shape({
            vertices: [],
            indices: []
        }, {MatrixClass: Matrix});
        assert.ok(shape.toRawTriangleArray().length == 0, "Passed!");
    });

    QUnit.test("construct empty Shape, test toRawLineArray", function (assert) {
        var shape = new Shape({
            vertices: [],
            indices: []
        }, {MatrixClass: Matrix});
        assert.ok(shape.toRawLineArray().length == 0, "Passed!");
    });

    QUnit.test("construct basic Shape, test toRawTriangleArray", function (assert) {
        var shape = new Shape({
            vertices: [],
            indices: []
        }, {MatrixClass: Matrix});
        assert.ok(shape.toRawTriangleArray().length == 0, "Passed!");
    });

    QUnit.test("construct basic Shape, test toRawLineArray", function (assert) {
        var shape = new Shape({
            vertices: [],
            indices: []
        }, {MatrixClass: Matrix});
        assert.ok(shape.toRawLineArray().length == 0, "Passed!");
    });

    QUnit.test("add and remove child", function (assert) {
        var shape = new Shape({}, {MatrixClass: Matrix});
        var childShape = new Shape({}, {MatrixClass: Matrix});

        shape.addChild(childShape);
        assert.deepEqual(shape.children, [childShape], "Child added!");

        shape.removeChild(childShape);
        assert.deepEqual(shape.children, [], "Child removed!");
    });

    QUnit.test("add multiple and remove one specific child", function (assert) {
        var shape = new Shape({}, {MatrixClass: Matrix});
        var childShape = new Shape({}, {MatrixClass: Matrix});
        var otherShape = new Shape({}, {MatrixClass: Matrix});

        shape.addChild(otherShape);
        shape.addChild(otherShape);
        shape.addChild(childShape);
        shape.addChild(otherShape);
        var startArray = [otherShape, otherShape, childShape, otherShape];
        assert.deepEqual(shape.children, startArray, "All child shapes added!");

        shape.removeChild(childShape);
        var endArray = [otherShape, otherShape, otherShape];
        assert.deepEqual(shape.children, endArray, "Specific child removed!");
    });

    QUnit.test("scale shapes", function (assert) {
        var shape = new Shape({}, {MatrixClass: Matrix});
        var child = new Shape({}, {MatrixClass: Matrix});
        shape.addChild(child);

        shape.scale(2,1,-1);
        var expected = [
            [2, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(shape.transform.matrix, expected, "parent scaled");
        assert.deepEqual(child.transform.matrix, expected, "child scaled");
    });

    QUnit.test("translate shapes", function (assert) {
        var shape = new Shape({}, {MatrixClass: Matrix});
        var child = new Shape({}, {MatrixClass: Matrix});
        shape.addChild(child);

        shape.translate(2,1,-1);
        var expected = [
            [1, 0, 0, 2],
            [0, 1, 0, 1],
            [0, 0, 1, -1],
            [0, 0, 0, 1]
        ];
        assert.deepEqual(shape.transform.matrix, expected, "parent translated");
        assert.deepEqual(child.transform.matrix, expected, "child translated");
    });

    QUnit.test("save/restore shapes", function (assert) {
        var shape = new Shape({}, {MatrixClass: Matrix});
        var child = new Shape({}, {MatrixClass: Matrix});
        shape.addChild(child);

        var expected = new Matrix().matrix;
        shape.save();
        assert.deepEqual(shape.transform.matrix, expected, "parent unaffected by save");
        assert.deepEqual(child.transform.matrix, expected, "child unaffected by save");

        shape.translate(2,1,-1);
        shape.restore();
        assert.deepEqual(shape.transform.matrix, expected, "parent restored");
        assert.deepEqual(child.transform.matrix, expected, "child restored");
    });

});
