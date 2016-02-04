(function() {
    window.SpriteLibrary = window.SpriteLibrary || {};

    var BUN_THICKNESS = 30;
    var BUN_LENGTH = 50;
    var BUN_COLOR = '#C09569';

    var HOTDOG_THICKNESS = 20;
    var HOTDOG_LENGTH = 80;
    var HOTDOG_OFFSET_X = -10;
    var HOTDOG_OFFSET_Y = -10;
    var HOTDOG_COLOR = '#AF3D3D';

    var NECK_ANGLE = -0.85 * Math.PI;
    var NECK_LENGTH = 30;
    var NECK_WIDTH = 20;
    var NECK_COLOR = '#422910';

    var HEAD_MAIN_RADIUS = 15;
    var HEAD_LENGTH = 25;
    var HEAD_SUB_RADIUS = 5;
    var HEAD_SUB_OFFSET_Y = 8;
    var HEAD_COLOR = '#633E19';
    var NOSE_COLOR = '#422910';

    var LEG_LENGTH = 30;
    var LEG_WIDTH = 7;
    var LEG_COLOR = '#422910';

    var TAIL_HEIGHT = 10;
    var TAIL_LENGTH = 50;
    var TAIL_COLOR = '#633E19';

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
        drawRect(renderingContext, HOTDOG_THICKNESS/2, -HOTDOG_THICKNESS/2, '#AF3D3D', HOTDOG_LENGTH, HOTDOG_THICKNESS);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(HOTDOG_THICKNESS/2, 0);
        drawCircle(renderingContext, '#AF3D3D', HOTDOG_THICKNESS/2);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(HOTDOG_THICKNESS/2 + HOTDOG_LENGTH, 0);
        drawCircle(renderingContext, '#AF3D3D', HOTDOG_THICKNESS/2);
        renderingContext.restore();
    };

    var drawBun = function(renderingContext) {
        renderingContext.save();
        drawRect(renderingContext, BUN_THICKNESS/2, -BUN_THICKNESS/2, '#C09569', BUN_LENGTH, BUN_THICKNESS);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(BUN_THICKNESS/2, 0);
        drawCircle(renderingContext, '#C09569', BUN_THICKNESS/2);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(BUN_THICKNESS/2 + BUN_LENGTH, 0);
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

    var moveUpHead = function(renderingContext) {
        renderingContext.translate(NECK_WIDTH/2, 0);
        renderingContext.rotate(NECK_ANGLE);
        renderingContext.translate(NECK_LENGTH, 0);
        renderingContext.rotate(-NECK_ANGLE);
    };

    var drawHead = function(renderingContext, headRotation) {
        renderingContext.save();
        renderingContext.rotate(headRotation);

        renderingContext.save();
        renderingContext.translate(NECK_WIDTH/2, 0);
        renderingContext.rotate(NECK_ANGLE);
        drawRect(renderingContext, 0, -NECK_WIDTH/2, NECK_COLOR, NECK_LENGTH, NECK_WIDTH);
        renderingContext.restore();

        renderingContext.save();
        moveUpHead(renderingContext);

        renderingContext.save();
        drawCircle(renderingContext, HEAD_COLOR, HEAD_MAIN_RADIUS);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(-HEAD_LENGTH, HEAD_SUB_OFFSET_Y);
        drawCircle(renderingContext, NOSE_COLOR, HEAD_SUB_RADIUS);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.fillStyle = HEAD_COLOR;
        renderingContext.beginPath();
        renderingContext.moveTo(0, -HEAD_MAIN_RADIUS);
        renderingContext.lineTo(-HEAD_LENGTH, HEAD_SUB_OFFSET_Y - HEAD_SUB_RADIUS);
        renderingContext.lineTo(-HEAD_LENGTH, HEAD_SUB_OFFSET_Y + HEAD_SUB_RADIUS);
        renderingContext.lineTo(0, HEAD_MAIN_RADIUS);
        renderingContext.closePath();
        renderingContext.fill();
        renderingContext.restore();

        renderingContext.restore();


        renderingContext.restore();
    };

    var drawLeg = function(renderingContext, TX, TY, legAngle) {
        renderingContext.save();
        renderingContext.translate(TX, TY);
        renderingContext.rotate(legAngle);
        drawRect(renderingContext, -LEG_WIDTH/2, 0, LEG_COLOR, LEG_WIDTH, LEG_LENGTH);
        renderingContext.restore();
    };

    var drawTail = function(renderingContext, tailRotation) {
        renderingContext.save();
        renderingContext.rotate(tailRotation);
        renderingContext.fillStyle = TAIL_COLOR;
        renderingContext.beginPath();
        renderingContext.moveTo(0, -TAIL_HEIGHT/2);
        renderingContext.lineTo(TAIL_LENGTH, 0);
        renderingContext.lineTo(0, TAIL_HEIGHT/2);
        renderingContext.closePath();
        renderingContext.fill();
        renderingContext.restore();
    }

    SpriteLibrary.hotdog = function(Specification) {
        var renderingContext = Specification.renderingContext;
        var headRotation = Specification.headRotation || 0;
        var tailRotation = Specification.tailRotation || 0;

        var leftLegsRotation = Specification.leftLegsRotation || 0;
        var rightLegsRotation = Specification.rightLegsRotation || 0;

        var leftFrontLegRotation = Specification.leftFrontLegRotation || leftLegsRotation;
        var rightFrontLegRotation = Specification.rightFrontLegRotation || rightLegsRotation;
        var leftRearLegRotation = Specification.leftRearLegRotation || leftLegsRotation;
        var rightRearLegRotation = Specification.rightRearLegRotation || rightLegsRotation;

        renderingContext.save();
        drawHead(renderingContext, headRotation);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(BUN_LENGTH + BUN_THICKNESS - TAIL_HEIGHT/2, 0);
        drawTail(renderingContext, tailRotation);
        renderingContext.restore();

        renderingContext.save();
        drawLeg(renderingContext, LEG_WIDTH/2, 0, leftFrontLegRotation);
        renderingContext.restore();

        renderingContext.save();
        drawLeg(renderingContext, LEG_WIDTH/2, 0, rightFrontLegRotation);
        renderingContext.restore();

        renderingContext.save();
        drawLeg(renderingContext, BUN_LENGTH + BUN_THICKNESS - LEG_WIDTH/2, 0, leftFrontLegRotation);
        renderingContext.restore();

        renderingContext.save();
        drawLeg(renderingContext, BUN_LENGTH + BUN_THICKNESS - LEG_WIDTH/2, 0, rightFrontLegRotation);
        renderingContext.restore();

        renderingContext.save();
        drawBody(renderingContext);
        renderingContext.restore();

    };

}());
