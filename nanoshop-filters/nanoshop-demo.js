/*
 * This demo script uses the Nanoshop module to apply a simple
 * filter on a canvas drawing.
 */
$(function () {
    var canvas = $("#picture")[0];
    var renderingContext = canvas.getContext("2d");

    var drawScene = function () {
        // Scene created by SirSeim (https://github.com/SirSeim)
        renderingContext.save();
        renderingContext.fillStyle = "#5FB1EA";
        renderingContext.fillRect(0,0,1023, 767);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.fillStyle = "#00D204";
        renderingContext.fillRect(0,576,1023,191);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(300, 250);
        renderingContext.scale(2, 2);
        SpriteLibrary.tardis({
            renderingContext: renderingContext,
            decimalDoorOpen: 0.8
        });
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(500, 570);
        SpriteLibrary.bb8({
            renderingContext: renderingContext,
            headRotation: .2 * Math.PI,
            bodyRotation: 10
        });
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(800, 600);
        renderingContext.scale(1.3, 1.3);
        SpriteLibrary.hotdog({
            renderingContext: renderingContext,
            headRotation: 0,
            tailRotation: .1 * Math.PI,
            leftLegsRotation: -.3 * Math.PI,
            rightLegsRotation: .1 * Math.PI
        });
        renderingContext.restore();

        if (makeEdge) {
            edge();
        }

        if (makeTopRight) {
            topRight();
        }

        if (makeDarker) {
            darken();
        }

        if (makeLessBlue) {
            lessBlue();
        }
    };


    var makeDarker = false;
    var darken = function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                Nanoshop.darkener
            ),
            0, 0
        );
    };
    // Set a little event handler to apply the filter.
    $("#apply-darkener").click(function () {
        if (makeDarker) {
            makeDarker = false;
            drawScene();
            $(this).html("Apply Darkener");
        } else {
            makeDarker = true;
            drawScene();
            $(this).html("Remove Darkener");
        }
    });

    var makeLessBlue = false;
    var lessBlue = function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                Nanoshop.lessBlue
            ),
            0, 0
        );
    };
    $("#apply-less-blue").click(function () {
        if (makeLessBlue) {
            makeLessBlue = false;
            drawScene();
            $(this).html("Apply Less Blue");
        } else {
            makeLessBlue = true;
            drawScene();
            $(this).html("Remove Less Blue");
        }
    });


    var makeEdge = false;
    var edge = function () {
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                NanoshopNeighborhood.basicEdgeDetector
                //NanoshopNeighborhood.averager // Convenience comment for easy switching.
            ),
            0, 0
        );
    };
    $("#apply-edge").click(function () {
        if (makeEdge) {
            makeEdge = false;
            drawScene();
            $(this).html("Apply Edge");
        } else {
            makeEdge = true;
            drawScene();
            $(this).html("Remove Edge");
        }
    });

    var makeTopRight = false;
    var topRight = function () {
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                NanoshopNeighborhood.fromTopRight
                //NanoshopNeighborhood.averager // Convenience comment for easy switching.
            ),
            0, 0
        );
    };
    $("#apply-top-right").click(function () {
        if (makeTopRight) {
            makeTopRight = false;
            drawScene();
            $(this).html("Apply Top Right");
        } else {
            makeTopRight = true;
            drawScene();
            $(this).html("Remove Top Right");
        }
    });

    drawScene();
});
