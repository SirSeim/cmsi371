(function() {
    window.SpriteLibrary = window.SpriteLibrary || {};

    var BUN_THICKNESS = 30;
    var BUN_LENGTH = 50;
    var BUN_COLOR = '#C09569';
    var HOTDOG_THICKNESS = 20;
    var HOTDOG_LENGTH = 80;
    var HOTDOG_OFFSET_X = -5;
    var HOTDOG_OFFSET_Y = -10;
    var HOTDOG_COLOR = '#AF3D3D';

    var drawCircle = function(renderingContext, color, radius) {
        renderingContext.save();
        renderingContext.fillStyle = color;
        renderingContext.beginPath();
        renderingContext.arc(0, 0, radius, 0, 2 * Math.PI, false);
        renderingContext.fill();
        renderingContext.restore();
    };

    var drawRect = function(renderingContext, TX, TY, color, width, height) {
        renderingContext.save();
        renderingContext.translate(TX, TY);
        renderingContext.fillStyle = color;
        renderingContext.fillRect(0,0, width, height);
        renderingContext.restore();
        console.log('her');
    };

    var drawHotDog = function(renderingContext) {
        renderingContext.save();
        drawRect(renderingContext, HOTDOG_THICKNESS, -HOTDOG_THICKNESS/2, '#AF3D3D', HOTDOG_LENGTH, HOTDOG_THICKNESS);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(HOTDOG_THICKNESS, 0);
        drawCircle(renderingContext, '#AF3D3D', HOTDOG_THICKNESS/2);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(HOTDOG_THICKNESS + HOTDOG_LENGTH, 0);
        drawCircle(renderingContext, '#AF3D3D', HOTDOG_THICKNESS/2);
        renderingContext.restore();
    };

    var drawBun = function(renderingContext) {
        renderingContext.save();
        drawRect(renderingContext, BUN_THICKNESS, -BUN_THICKNESS/2, '#C09569', BUN_LENGTH, BUN_THICKNESS);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(BUN_THICKNESS, 0);
        drawCircle(renderingContext, '#C09569', BUN_THICKNESS/2);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(BUN_THICKNESS + BUN_LENGTH, 0);
        drawCircle(renderingContext, '#C09569', BUN_THICKNESS/2);
        renderingContext.restore();
    };

    var drawBody = function(renderingContext) {
        renderingContext.save();
        renderingContext.translate(HOTDOG_OFFSET_X, HOTDOG_OFFSET_Y);
        drawHotDog(renderingContext);
        renderingContext.restore();

        renderingContext.save();
        drawBun(renderingContext);
        renderingContext.restore();
    };

    var drawHead = function(renderingContext) {
        renderingContext.save();

        renderingContext.restore();
    };

    SpriteLibrary.hotdog = function(Specification) {
        var renderingContext = Specification.renderingContext;

        renderingContext.save();
        drawBody(renderingContext);
        renderingContext.restore();

    };

}());
