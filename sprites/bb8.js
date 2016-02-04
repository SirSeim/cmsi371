(function() {
    window.SpriteLibrary = window.SpriteLibrary || {};

    var BALL_RADIUS = 50;
    var HEAD_RADIUS = 30;
    var HEAD_BOWL = 80;
    var MAIN_EYE_RADIUS = 10;
    var MAIN_EYE_OFFSET = 2;
    var SUB_EYE_RADIUS = 4;
    var SUB_EYE_OFFSET_Y = 8;
    var SUB_EYE_OFFSET_X = 17;

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
        drawCircle(renderingContext, '#BFBFBF', BALL_RADIUS);
        drawCircle(renderingContext, 'orange', BALL_RADIUS*2/3);
        drawCircle(renderingContext, '#D8D8D8', BALL_RADIUS/2);
        var lineWidth = BALL_RADIUS/8;
        var lineHeight = BALL_RADIUS/4;
        drawRect(renderingContext, -lineWidth/2, -BALL_RADIUS/2, 'orange', lineWidth, lineHeight);
        drawRect(renderingContext, -BALL_RADIUS/2, -lineWidth/2, 'orange', lineHeight, lineWidth);
        drawRect(renderingContext, -lineWidth/2, BALL_RADIUS/2, 'orange', lineWidth, -lineHeight);
        drawRect(renderingContext, BALL_RADIUS/2, -lineWidth/2, 'orange', -lineHeight, lineWidth);

    };

    var drawMainEye = function(renderingContext) {
        renderingContext.save();
        renderingContext.fillStyle = '#000000';
        renderingContext.beginPath();
        renderingContext.arc(0, 0, MAIN_EYE_RADIUS, 0, 2 * Math.PI, false);
        renderingContext.fill();
        renderingContext.restore();
    };

    var drawSubEye = function(renderingContext) {
        renderingContext.save();
        renderingContext.fillStyle = '#000000';
        renderingContext.beginPath();
        renderingContext.arc(0, 0, SUB_EYE_RADIUS, 0, 2 * Math.PI, false);
        renderingContext.fill();
        renderingContext.restore();
    };

    var drawHead = function(renderingContext) {
        renderingContext.save();
        renderingContext.fillStyle = '#CCCCCC';
        renderingContext.beginPath();
        renderingContext.arc(0, 0, HEAD_RADIUS, 0, 1 * Math.PI, true);
        renderingContext.fill();
        renderingContext.restore();

        renderingContext.save();
        renderingContext.fillStyle = '#A6A6A6';
        renderingContext.beginPath();
        renderingContext.moveTo(-HEAD_RADIUS, 0);
        renderingContext.lineTo(HEAD_RADIUS, 0);
        renderingContext.lineTo(0, BALL_RADIUS);
        renderingContext.closePath();
        renderingContext.fill();
        renderingContext.restore();

        renderingContext.save();
        var centerMainEye = HEAD_RADIUS/2 + MAIN_EYE_OFFSET;
        renderingContext.translate(0, -centerMainEye);
        drawMainEye(renderingContext);
        renderingContext.restore();

        renderingContext.save();
        var subEyeY = HEAD_RADIUS/2 - SUB_EYE_OFFSET_Y;
        var subEyeX = SUB_EYE_OFFSET_X;
        renderingContext.translate(subEyeX, -subEyeY);
        drawSubEye(renderingContext);
        renderingContext.restore();
    };

    SpriteLibrary.bb8 = function(Specification) {
        var renderingContext = Specification.renderingContext;
        var headRotation = Specification.headRotation || 0.0;
        var bodyRotation = Specification.bodyRotation || 0.0;

        renderingContext.save();
        renderingContext.translate(0, BALL_RADIUS + HEAD_RADIUS);
        renderingContext.rotate(headRotation);
        renderingContext.translate(0, -BALL_RADIUS);
        drawHead(renderingContext);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(0, BALL_RADIUS + HEAD_RADIUS);
        renderingContext.rotate(bodyRotation);
        drawBody(renderingContext);
        renderingContext.restore();

        
    }

}());
