var DEFAULT_WIDTH = 640,
    DEFAULT_HEIGHT = 960,
    SANTA_SIZE = 250,
    SANTA_PADDING = 10,
    DIRECTION = {LEFT : 0, RIGHT : 1},
    MINCE_PIE_WIDTH = 114,
    MINCE_PIE_HEIGHT = 72,
    MINCE_PIE_THROW_Y_THRESHOLD = 20,
    stage = new PIXI.Stage(0x55813a, true),
    renderer = PIXI.autoDetectRenderer(DEFAULT_WIDTH, DEFAULT_HEIGHT, {transparent: true}),
    santaTexture,
    santa,
    mincePie,
    santaSpeed = 5,
    santaDirection = DIRECTION.RIGHT,
    scaleRatio = 1,
    mincePieBeingDragged = false,
    mincePieDragFrames = 0,
    mincePieOrigX,
    mincePieOrigY,
    mincePieThrowStartX,
    mincePieThrowStartY,
    mincePieThrowLastX,
    mincePieThrowLastY,
    mincePieVelocityX,
    mincePieVelocityY,
    mincePieDoFling = false,
    sceneContainers = {
        intro: new PIXI.DisplayObjectContainer(),
        game: new PIXI.DisplayObjectContainer(),
        score: new PIXI.DisplayObjectContainer()
    },
    currentScene;

init();

function init() {

    initIntroScene();
    initGameScene();
    initScoreScene();

    switchScene('intro');

    document.body.appendChild(renderer.view);

    window.addEventListener('resize', onResize, false);

    initInteractions();

    rescale();

    animate();

}

function switchScene(scene) {

    currentScene = scene;

    for( var key in sceneContainers ) {

        if( sceneContainers.hasOwnProperty(key) ) {
            sceneContainers[key].visible = key === scene;
        }

    }

}

function initIntroScene() {

    var introContainer = sceneContainers.intro;

    introContainer.width = DEFAULT_WIDTH;
    introContainer.height = DEFAULT_HEIGHT;

    // Title

    var title = new PIXI.Text("Santa\nWants\nPies", {font:'90px Courier', fill:'white', align:'center', stroke: '#333', strokeThickness: 2});

    title.anchor.x = 0.5;

    title.position.x = DEFAULT_WIDTH / 2;
    title.position.y = 100;

    introContainer.addChild(title);

    stage.addChild(introContainer);

}

function initGameScene() {

    var gameContainer = sceneContainers.game;

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
    mincePie.position.y = DEFAULT_HEIGHT - MINCE_PIE_HEIGHT/2 - 100;

    mincePieOrigX = mincePie.position.x;
    mincePieOrigY = mincePie.position.y;

    gameContainer.addChild(mincePie);

    stage.addChild(gameContainer);

}

function initGameScene() {

    var gameContainer = sceneContainers.game;

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
    mincePie.position.y = DEFAULT_HEIGHT - MINCE_PIE_HEIGHT/2 - 100;

    mincePieOrigX = mincePie.position.x;
    mincePieOrigY = mincePie.position.y;

    gameContainer.addChild(mincePie);

    stage.addChild(gameContainer);

}

function initScoreScene() {

    // TODO

}

function initInteractions() {

    mincePie.touchstart = mincePie.mousedown = function(data){

        mincePieBeingDragged = true;

        console.log( 'down', data );

        mincePieThrowStartX = data.originalEvent.clientX || data.global.x;
        mincePieThrowStartY = data.originalEvent.clientY || data.global.y;

    };

    mincePie.touchmove = mincePie.mousemove = function(data) {

        if( mincePieBeingDragged ) {

            //console.log('move', data);

            mincePieDragFrames++;

            var x = data.originalEvent.clientX || data.global.x,
                y = data.originalEvent.clientY || data.global.y;

            mincePieVelocityX = (x - mincePieThrowStartX) / mincePieDragFrames;
            mincePieVelocityY = (y - mincePieThrowStartY) / mincePieDragFrames;

            mincePieThrowLastX = x;
            mincePieThrowLastY = y;

            mincePie.position.x = mincePieOrigX + (mincePieThrowLastX - mincePieThrowStartX);
            mincePie.position.y = mincePieOrigY + (mincePieThrowLastY - mincePieThrowStartY);

        }

    };

    //stage.touchend = stage.mouseup = function(data){
    mincePie.mouseup = mincePie.touchend = mincePie.mouseupoutside = mincePie.touchendoutside = function(data) {

        if( mincePieBeingDragged ) {

            console.log( 'up', data );

            var y = data.originalEvent.clientY || data.global.y;

            if( mincePieThrowStartY - y > MINCE_PIE_THROW_Y_THRESHOLD ) {

                // Fling the mince pie
                mincePieDoFling = true;

            } else {

                mincePie.position.x = mincePieOrigX;
                mincePie.position.y = mincePieOrigY;

            }

            mincePieBeingDragged = false;
            mincePieDragFrames = 0;

        }

    };

}

function updateSantaPosition() {

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

}

function endMincePieFling() {

    mincePieDoFling = false;

    mincePieVelocityX = 0;
    mincePieVelocityY = 0;

    mincePie.position.x = mincePieOrigX;
    mincePie.position.y = mincePieOrigY;

}

function updateMincePiePosition() {

    if( mincePieDoFling ) {

        if( mincePie.position.y > -MINCE_PIE_HEIGHT ) {

            mincePie.position.y += mincePieVelocityY;

            // Hit detection...
            //if(  ) {

            //}

        } else {

            console.log('out of bounds - throw finished');
            endMincePieFling();

        }

    }

    if( mincePieDoFling ) {

        if( mincePie.position.x > -MINCE_PIE_WIDTH && mincePie.position.x < DEFAULT_WIDTH + MINCE_PIE_WIDTH ) {

            mincePie.position.x += mincePieVelocityX;



        } else {

            console.log('out of bounds - throw finished');
            endMincePieFling();

        }

    }

}

function animate() {

    if( currentScene === 'game' ) {

        updateSantaPosition();
        updateMincePiePosition();

    }

    //TWEEN.update();

    // Reason for applying and then un-applying is so we can use our expected coordinates & sizes for manipulating objects
    // See: http://ezelia.com/2013/pixi-tutorial
    applyRatio(scaleRatio);

    renderer.render(stage);

    applyRatio(1/scaleRatio);

    requestAnimationFrame( animate );

}

function onResize() {

    rescale();

}

function rescale() {

    scaleRatio = Math.min(window.innerWidth / DEFAULT_WIDTH, window.innerHeight / DEFAULT_HEIGHT);

    renderer.resize( DEFAULT_WIDTH * scaleRatio, DEFAULT_HEIGHT * scaleRatio );

}

function applyRatio(ratio) {

    for(var i = 0; i < stage.children.length; i++) {

        var displayObjectContainer = stage.children[i];

        displayObjectContainer.scale.x = displayObjectContainer.scale.x * ratio;
        displayObjectContainer.scale.y = displayObjectContainer.scale.y * ratio;

    }

}
