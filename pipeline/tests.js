QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});

QUnit.test("construct empty Shape, test toRawTriangleArray", function (assert) {
    var shape = new Shape({
        vertices: [],
        indices: []
    });
    assert.ok(shape.toRawTriangleArray().length == 0, "Passed!");
});

QUnit.test("construct empty Shape, test toRawLineArray", function (assert) {
    var shape = new Shape({
        vertices: [],
        indices: []
    });
    assert.ok(shape.toRawLineArray().length == 0, "Passed!");
});

QUnit.test("construct basic Shape, test toRawTriangleArray", function (assert) {
    var shape = new Shape({
        vertices: [],
        indices: []
    });
    assert.ok(shape.toRawTriangleArray().length == 0, "Passed!");
});

QUnit.test("construct basic Shape, test toRawLineArray", function (assert) {
    var shape = new Shape({
        vertices: [],
        indices: []
    });
    assert.ok(shape.toRawLineArray().length == 0, "Passed!");
});

QUnit.test("add and remove child", function (assert) {
    var shape = new Shape({});
    var childShape = new Shape({});

    shape.addChild(childShape);
    assert.deepEqual(shape.children, [childShape], "Child added!");

    shape.removeChild(childShape);
    assert.deepEqual(shape.children, [], "Child removed!");
});

QUnit.test("add multiple and remove one specific child", function (assert) {
    var shape = new Shape({});
    var childShape = new Shape({});
    var otherShape = new Shape({});

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
