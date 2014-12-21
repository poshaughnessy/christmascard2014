var stage,
    renderer,
    santaTexture,
    santa,
    santaSpeed = 5,
    SANTA_SIZE = 250,
    SANTA_PADDING = 10;

init();

function init() {

    stage = new PIXI.Stage(0x55813a);

    santaTexture = PIXI.Texture.fromImage('img/santa-mouth-open-250px.png');

    santa = new PIXI.Sprite(santaTexture);

    santa.position.x = SANTA_PADDING;
    santa.position.y = 50;

    stage.addChild(santa);

    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.view);

    window.addEventListener('resize', onResize, false);

    animate();

}

function animate() {

    renderer.render(stage);

    if( santa.position.x < window.innerWidth - SANTA_SIZE - SANTA_PADDING ) {
        santa.position.x += santaSpeed;
    }

    requestAnimationFrame( animate );

}

function onResize() {

    // TODO resize and reposition elements too

    renderer.resize(window.innerWidth, window.innerHeight);

}
