var SANTA_SIZE = 250,
    SANTA_PADDING = 10,
    DIRECTION = {LEFT : 0, RIGHT : 1},
    MINCE_PIE_WIDTH = 114,
    MINCE_PIE_HEIGHT = 72,
    DEFAULT_WIDTH = 640,
    DEFAULT_HEIGHT = 960,
    stage = new PIXI.Stage(0x55813a),
    gameContainer = new PIXI.DisplayObjectContainer(),
    renderer = PIXI.autoDetectRenderer(DEFAULT_WIDTH, DEFAULT_HEIGHT),
    santaTexture,
    santa,
    mincePie,
    santaSpeed = 5,
    santaDirection = DIRECTION.RIGHT,
    scaleRatio = 1;

init();

function init() {

    gameContainer.width = DEFAULT_WIDTH;
    gameContainer.height = DEFAULT_HEIGHT;

    // Santa

    santaTexture = PIXI.Texture.fromImage('img/santa-mouth-open-250px.png');

    santa = new PIXI.Sprite(santaTexture);

    santa.position.x = SANTA_PADDING;
    santa.position.y = 50;

    gameContainer.addChild(santa);

    // Mince pie

    var mincePieTexture = PIXI.Texture.fromImage('img/mince-pie.png');

    mincePie = new PIXI.Sprite(mincePieTexture);

    console.log('DEFAULT_WIDTH, MINCE_PIE_WIDTH', DEFAULT_WIDTH, MINCE_PIE_WIDTH);

    mincePie.position.x = (DEFAULT_WIDTH / 2) - (MINCE_PIE_WIDTH / 2);
    mincePie.position.y = DEFAULT_HEIGHT - MINCE_PIE_HEIGHT - 50;

    console.log('mince pie pos x', mincePie.position.x);

    gameContainer.addChild(mincePie);

    stage.addChild(gameContainer);

    document.body.appendChild(renderer.view);

    window.addEventListener('resize', onResize, false);

    rescale();

    /*
    santa.position.x = SANTA_PADDING * scaleRatio;
    santa.position.y = 50 * scaleRatio;

    mincePie.position.x = renderer.width / 2 - ((MINCE_PIE_WIDTH*scaleRatio)/2);
    mincePie.position.y = renderer.height - (MINCE_PIE_HEIGHT*scaleRatio) - (50 * scaleRatio);
    */

    animate();

}

function animate() {

    // Reason for applying and then un-applying is so we can use our expected coordinates & sizes for manipulating objects
    // See: http://ezelia.com/2013/pixi-tutorial
    applyRatio(gameContainer, scaleRatio);

    renderer.render(stage);

    applyRatio(gameContainer, 1/scaleRatio);

    if( santaDirection == DIRECTION.RIGHT ) {

        if( santa.position.x < renderer.width - SANTA_PADDING ) {
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

    requestAnimationFrame( animate );

}

function onResize() {

    console.log('window width and height', window.innerWidth, window.innerHeight);

    console.log('container width and height', gameContainer.width, gameContainer.height);

    console.log('container scale x and y', gameContainer.scale.x, gameContainer.scale.y);

    console.log('renderer width and height', renderer.width, renderer.height );

    //gameContainer.scale.x = gameContainer.width / window.innerWidth;
    //gameContainer.height = window.innerHeight;

    //renderer.resize(window.innerWidth, window.innerHeight);

    rescale();

}

function rescale() {

    scaleRatio = Math.min(window.innerWidth / DEFAULT_WIDTH, window.innerHeight / DEFAULT_HEIGHT);

    //scaleRatioX = window.innerWidth / DEFAULT_WIDTH;
    //scaleRatioY = window.innerHeight / DEFAULT_HEIGHT;

    renderer.resize( DEFAULT_WIDTH * scaleRatio, DEFAULT_HEIGHT * scaleRatio );

    //gameContainer.scale = ratio;

    //applyRatio(gameContainer, scaleRatioX, scaleRatioY);

}

function applyRatio(displayObject, ratio) {

    displayObject.position.x = displayObject.position.x * ratio;
    displayObject.position.y = displayObject.position.y * ratio;
    displayObject.scale.x = displayObject.scale.x * ratio;
    displayObject.scale.y = displayObject.scale.y * ratio;

    for (var i = 0; i < displayObject.children.length; i++) {
        applyRatio(displayObject.children[i], ratio);
    }

}
