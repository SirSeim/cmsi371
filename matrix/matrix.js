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
