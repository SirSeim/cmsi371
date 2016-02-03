(function() {
    window.SpriteLibrary = window.SpriteLibrary || {};

    var BOX_HEIGHT = 175;
    var BOX_WIDTH = 100;
    var LIGHT_HEIGHT = 14;
    var LIGHT_WIDTH = 9;
    var LIGHT_BORDER = 2;
    var BOX_BORDER = 10;
    var DOOR_PANEL_BORDER = 8;

    var drawPanel = function(renderingContext, isLeft, height, width) {

    };

    var drawDoor = function(renderingContext, isLeft, decimalOpen) {
        renderingContext.save();
        var doorHeight = BOX_HEIGHT - (BOX_BORDER * 2);
        var innerDoorHeightDelta = decimalOpen * 5;
        var doorWidth = (1 - decimalOpen) * ((isLeft ? (BOX_WIDTH - (BOX_BORDER * 2)) : -(BOX_WIDTH - (BOX_BORDER * 2))) / 2);


        var panelHeight = ((BOX_HEIGHT - (BOX_BORDER * 2)) - (5 * DOOR_PANEL_BORDER)) / 4;
        var  

        renderingContext.fillStyle = '#002F58';
        renderingContext.beginPath();
        renderingContext.moveTo(0, 0);
        renderingContext.lineTo(doorWidth, innerDoorHeightDelta);
        renderingContext.lineTo(doorWidth, doorHeight - (innerDoorHeightDelta * 2));
        renderingContext.lineTo(0, doorHeight);
        renderingContext.closePath();
        renderingContext.fill();

        renderingContext.restore();
    };

    var drawLight = function(renderingContext) {
        renderingContext.save();

        // Yellow
        renderingContext.save();
        renderingContext.translate(-LIGHT_WIDTH/2, -LIGHT_HEIGHT);
        renderingContext.fillStyle = '#FFFF7F';
        renderingContext.fillRect(0,0, LIGHT_WIDTH, LIGHT_HEIGHT);
        renderingContext.restore();

        // Left Bar
        renderingContext.save();
        renderingContext.translate((-LIGHT_WIDTH/2) - LIGHT_BORDER, (-LIGHT_HEIGHT) - LIGHT_BORDER);
        renderingContext.fillStyle = '#595959';
        renderingContext.fillRect(0,0, LIGHT_BORDER, LIGHT_HEIGHT + LIGHT_BORDER);
        renderingContext.restore();

        // Right Bar
        renderingContext.save();
        renderingContext.translate((LIGHT_WIDTH/2), (-LIGHT_HEIGHT) - LIGHT_BORDER);
        renderingContext.fillStyle = '#595959';
        renderingContext.fillRect(0,0, LIGHT_BORDER, LIGHT_HEIGHT + LIGHT_BORDER);
        renderingContext.restore();

        // Top Bar
        renderingContext.save();
        renderingContext.translate((-LIGHT_WIDTH/2) - LIGHT_BORDER, (-LIGHT_HEIGHT) - LIGHT_BORDER);
        renderingContext.fillStyle = '#595959';
        renderingContext.fillRect(0,0, LIGHT_WIDTH + (LIGHT_BORDER*2), LIGHT_BORDER);
        renderingContext.restore();

        // Middle Top-Down Bar
        renderingContext.save();
        renderingContext.translate(-LIGHT_BORDER/2, (-LIGHT_HEIGHT) - LIGHT_BORDER);
        renderingContext.fillStyle = '#595959';
        renderingContext.fillRect(0,0, LIGHT_BORDER, LIGHT_HEIGHT + LIGHT_BORDER);
        renderingContext.restore();

        // Middle Left-Right Bar
        renderingContext.save();
        renderingContext.translate((-LIGHT_WIDTH/2) - LIGHT_BORDER, (-LIGHT_HEIGHT/2) - (LIGHT_BORDER/2));
        renderingContext.fillStyle = '#595959';
        renderingContext.fillRect(0,0, LIGHT_WIDTH + (LIGHT_BORDER*2), LIGHT_BORDER);
        renderingContext.restore();

        renderingContext.restore();
    };

    SpriteLibrary.tardis = function(tardisSpecification) {
        var renderingContext = tardisSpecification.renderingContext;
        var decimalDoorOpen = tardisSpecification.decimalDoorOpen || 0.3;

        renderingContext.save();
        renderingContext.translate(-BOX_WIDTH / 2, LIGHT_HEIGHT);
        renderingContext.fillStyle = '#003B6F';
        renderingContext.fillRect(0,0,BOX_WIDTH,BOX_HEIGHT);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(-BOX_WIDTH / 2, LIGHT_HEIGHT);
        renderingContext.translate(BOX_BORDER, BOX_BORDER);
        renderingContext.fillStyle = '#00172C';
        renderingContext.fillRect(0,0, BOX_WIDTH - (BOX_BORDER * 2), BOX_HEIGHT - (BOX_BORDER * 2));
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(-BOX_WIDTH / 2, LIGHT_HEIGHT);
        renderingContext.translate(BOX_BORDER, BOX_BORDER);
        drawDoor(renderingContext, true, decimalDoorOpen);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(BOX_WIDTH / 2, LIGHT_HEIGHT);
        renderingContext.translate(-BOX_BORDER, BOX_BORDER);
        drawDoor(renderingContext, false, decimalDoorOpen);
        renderingContext.restore();

        renderingContext.save();
        renderingContext.translate(0, LIGHT_HEIGHT);
        drawLight(renderingContext);
        renderingContext.restore();
    }

}());
