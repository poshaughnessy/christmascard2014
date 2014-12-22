var SANTA_SIZE = 250,
    SANTA_PADDING = 10,
    DIRECTION = {LEFT : 0, RIGHT : 1},
    MINCE_PIE_WIDTH = 114,
    MINCE_PIE_HEIGHT = 72,
    stage = new PIXI.Stage(0x55813a),
    gameContainer = new PIXI.DisplayObjectContainer(),
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight),
    santaTexture,
    santa,
    mincePie,
    santaSpeed = 5,
    santaDirection = DIRECTION.RIGHT;

init();

function init() {

    stage ;

    // Santa

    santaTexture = PIXI.Texture.fromImage('img/santa-mouth-open-250px.png');

    santa = new PIXI.Sprite(santaTexture);

    santa.position.x = SANTA_PADDING;
    santa.position.y = 50;

    gameContainer.addChild(santa);

    // Mince pie

    var mincePieTexture = PIXI.Texture.fromImage('img/mince-pie.png');

    mincePie = new PIXI.Sprite(mincePieTexture);

    mincePie.position.x = window.innerWidth / 2 - (MINCE_PIE_WIDTH/2);
    mincePie.position.y = window.innerHeight - MINCE_PIE_HEIGHT - 50;

    gameContainer.addChild(mincePie);

    stage.addChild(gameContainer);

    document.body.appendChild(renderer.view);

    window.addEventListener('resize', onResize, false);

    animate();

}

function animate() {

    renderer.render(stage);

    if( santaDirection == DIRECTION.RIGHT ) {

        if( santa.position.x < window.innerWidth - SANTA_SIZE - SANTA_PADDING ) {
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

    //gameContainer.scale.x = gameContainer.width / window.innerWidth;
    //gameContainer.height = window.innerHeight;

    //renderer.resize(window.innerWidth, window.innerHeight);

}
