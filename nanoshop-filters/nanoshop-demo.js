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

        if (neighborFiltered) {
            filterNeighbor();
        }

        if (nanoFiltered) {
            filterNano();
        }
    };


    var nanoFiltered = false;
    var filterNano = function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                Nanoshop.darkener
            ),
            0, 0
        );
    };
    // Set a little event handler to apply the filter.
    $("#apply-nanoshop-button").click(function () {
        if (nanoFiltered) {
            nanoFiltered = false;
            drawScene();
            $(this).html("Apply NanoShop");
        } else {
            nanoFiltered = true;
            drawScene();
            $(this).html("Remove NanoShop");
        }
    });


    var neighborFiltered = false;
    var filterNeighbor = function () {
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
    $("#apply-neighborhood-button").click(function () {
        if (neighborFiltered) {
            neighborFiltered = false;
            drawScene();
            $(this).html("Apply NanoShop Neighborhood");
        } else {
            neighborFiltered = true;
            drawScene();
            $(this).html("Remove NanoShop Neighborhood");
        }
    });

    drawScene();
});
