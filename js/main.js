var SANTA_SIZE = 250,
    SANTA_PADDING = 10,
    DIRECTION = {LEFT : 0, RIGHT : 1},
    MINCE_PIE_WIDTH = 114,
    MINCE_PIE_HEIGHT = 72,
    DEFAULT_WIDTH = 640,
    DEFAULT_HEIGHT = 960,
    stage = new PIXI.Stage(0x55813a, true),
    gameContainer = new PIXI.DisplayObjectContainer(),
    renderer = PIXI.autoDetectRenderer(DEFAULT_WIDTH, DEFAULT_HEIGHT),
    santaTexture,
    santa,
    mincePie,
    santaSpeed = 5,
    santaDirection = DIRECTION.RIGHT,
    scaleRatio = 1,
    mincePieOrigX,
    mincePieOrigY,
    mincePieBeingDragged = false,
    mincePieThrowStartX,
    mincePieThrowStartY,
    mincePieThrowYThreshold = 20,
    mincePieThrowSpeed;

init();

function init() {

    gameContainer.width = DEFAULT_WIDTH;
    gameContainer.height = DEFAULT_HEIGHT;

    // Santa

    santaTexture = PIXI.Texture.fromImage('img/santa-mouth-open-250px.png');

    santa = new PIXI.Sprite(santaTexture);

    santa.anchor.x = 0;

    santa.position.x = SANTA_PADDING;
    santa.position.y = 50;

    gameContainer.addChild(santa);

    // Mince pie

    var mincePieTexture = PIXI.Texture.fromImage('img/mince-pie.png');

    mincePie = new PIXI.Sprite(mincePieTexture);

    mincePie.interactive = true;

    mincePie.anchor.x = 0.5;
    mincePie.anchor.y = 0.5;

    mincePie.position.x = (DEFAULT_WIDTH / 2);
    mincePie.position.y = DEFAULT_HEIGHT - MINCE_PIE_HEIGHT - 50;

    mincePieOrigX = mincePie.position.x;
    mincePieOrigY = mincePie.position.y;

    gameContainer.addChild(mincePie);

    stage.addChild(gameContainer);

    document.body.appendChild(renderer.view);

    window.addEventListener('resize', onResize, false);

    initInteractions();

    rescale();

    animate();

}

function initInteractions() {

    mincePie.mousedown = function(mouseData){

        mincePieBeingDragged = true;

        console.log( 'down', mouseData );

        mincePieThrowStartX = mouseData.originalEvent.clientX;
        mincePieThrowStartY = mouseData.originalEvent.clientY;

    };

    mincePie.mousemove = function(mouseData) {

        if( mincePieBeingDragged ) {

            //console.log('move', mouseData);

            mincePie.position.x = mincePieOrigX + (mouseData.originalEvent.clientX - mincePieThrowStartX);
            mincePie.position.y = mincePieOrigY + (mouseData.originalEvent.clientY - mincePieThrowStartY);

        }

    };

    stage.mouseup = function(mouseData){

        if( mincePieBeingDragged ) {

            console.log( 'up', mouseData );

            mincePieBeingDragged = false;

            var endX = mouseData.originalEvent.clientX,
                endY = mouseData.originalEvent.clientY;

            // TODO make it fling up appropriately if movement passes threshold, otherwise reset position

            mincePie.position.x = mincePieOrigX;
            mincePie.position.y = mincePieOrigY;

        }

    };

    mincePie.touchstart = function(touchData){

    };

    mincePie.touchend = function(touchData){

    };


    /*
    mincePie.tap = function(touchData){

    };

    mincePie.click = function(mouseData){

    };

    mincePie.mouseover = function(mouseData){

    };

    mincePie.mouseout = function(mouseData){

    };

    */

}

function animate() {

    if( santaDirection == DIRECTION.RIGHT ) {

        if( santa.position.x < DEFAULT_WIDTH - SANTA_SIZE - SANTA_PADDING ) {
            santa.position.x += santaSpeed;
        } else {
            santaDirection = DIRECTION.LEFT;
        }

    } else {

        if( santa.position.x > SANTA_PADDING ) {
            santa.position.x -= santaSpeed;
        } else {
            santaDirection = DIRECTION.RIGHT;
        }

    }

    // Reason for applying and then un-applying is so we can use our expected coordinates & sizes for manipulating objects
    // See: http://ezelia.com/2013/pixi-tutorial
    applyRatio(gameContainer, scaleRatio);

    renderer.render(stage);

    applyRatio(gameContainer, 1/scaleRatio);

    requestAnimationFrame( animate );

}

function onResize() {

    rescale();

}

function rescale() {

    scaleRatio = Math.min(window.innerWidth / DEFAULT_WIDTH, window.innerHeight / DEFAULT_HEIGHT);

    renderer.resize( DEFAULT_WIDTH * scaleRatio, DEFAULT_HEIGHT * scaleRatio );

}

function applyRatio(displayObject, ratio) {

    displayObject.scale.x = displayObject.scale.x * ratio;
    displayObject.scale.y = displayObject.scale.y * ratio;

}
