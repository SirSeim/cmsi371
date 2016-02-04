(function() {
    window.SpriteLibrary = window.SpriteLibrary || {};

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
    };

    var drawBody = function(renderingContext) {
        renderingContext.save();

        renderingContext.restore();
    };

    var drawHead = function(renderingContext) {
        renderingContext.save();

        renderingContext.restore();
    };

    SpriteLibrary.hotdog = function(Specification) {
        var renderingContext = Specification.renderingContext;


    };

}());
