var TIME_PER_GAME = 15,
    TIMER_WARN_THRESHOLD = 3,
    DEFAULT_WIDTH = 360,
    DEFAULT_HEIGHT = 640,
    SANTA_SIZE = 250,
    SANTA_BUFFER_LEFT = 25,
    SANTA_BUFFER_RIGHT = 0,
    DIRECTION = {LEFT : 0, RIGHT : 1},
    MINCE_PIE_WIDTH = 114,
    MINCE_PIE_HEIGHT = 72,
    MINCE_PIE_THROW_Y_THRESHOLD = 20,
    SCORE_WIN_THRESHOLD = 10,
    SANTA_START_SPEED = 5,
    SANTA_ACCELERATION = 1,
    stage = new PIXI.Stage(0x55813a, true),
    renderer = PIXI.autoDetectRenderer(DEFAULT_WIDTH, DEFAULT_HEIGHT, {transparent: true}),
    timerOKTexture = PIXI.Texture.fromImage('img/timer.png'),
    timerWarnTexture = PIXI.Texture.fromImage('img/timer-red.png'),
    santaTexture = PIXI.Texture.fromImage('img/santa-mouth-open-250px.png'),
    santaYumTexture = PIXI.Texture.fromImage('img/santa-yum-250px.png'),
    mincePieTexture = PIXI.Texture.fromImage('img/mince-pie.png'),
    santa,
    mincePie,
    timerIcon,
    timerText,
    scoreText,
    scoreResultText,
    winText,
    loseText,
    tryAgainButton,
    timer = TIME_PER_GAME,
    timerTimeout,
    textureTimeout,
    score = 0,
    santaSpeed = SANTA_START_SPEED,
    scaleRatio = 1,
    santaDirection = DIRECTION.RIGHT,
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
        result: new PIXI.DisplayObjectContainer()
    },
    currentScene,
    audioBufferList,
    audioContext,
    audioYum,
    playingSound = false;

init();

function init() {

    initIntroScene();
    initGameScene();
    initResultScene();

    initAudio();

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

    var title = new PIXI.Text('Santa\nWants\nPies', {font:'60px Courier', fill:'white', align:'center', stroke: '#333', strokeThickness: 2});

    title.anchor.x = 0.5;

    title.position.x = DEFAULT_WIDTH / 2;
    title.position.y = 20;

    introContainer.addChild(title);

    // Decorative mince pie

    var introMincePie = new PIXI.Sprite(mincePieTexture);

    introMincePie.interactive = true;

    introMincePie.width = 100;
    introMincePie.height = 100;

    introMincePie.anchor.x = 0.5;

    introMincePie.position.x = DEFAULT_WIDTH / 2;
    introMincePie.position.y = title.position.y + title.height + 10;

    introContainer.addChild(introMincePie);

    // Instructions text

    var instructions = new PIXI.Text('Fling Santa as many mince \npies as you can before \nthe time runs out!',
        {font:'30px Helvetica', fill:'white', align:'center'});

    instructions.anchor.x = 0.5;

    instructions.position.x = DEFAULT_WIDTH / 2;
    instructions.position.y = introMincePie.position.y + introMincePie.height + 40;

    instructions.width = DEFAULT_WIDTH - 100;

    introContainer.addChild(instructions);

    // Ready button

    var textureButton = PIXI.Texture.fromImage('img/button-ready.png');

    var button = new PIXI.Sprite(textureButton);
    button.buttonMode = true;

    button.position.x = 10;
    button.position.y = DEFAULT_HEIGHT - 80;

    button.width = DEFAULT_WIDTH - 20;
    button.height = 80;

    button.interactive = true;

    introContainer.addChild(button);

    stage.addChild(introContainer);

    button.mousedown = button.touchstart = function(data) {
        startGame();
    };

}

function initGameScene() {

    var gameContainer = sceneContainers.game;

    gameContainer.width = DEFAULT_WIDTH;
    gameContainer.height = DEFAULT_HEIGHT;

    // Timer

    timerIcon = new PIXI.Sprite(timerOKTexture);

    timerIcon.position.x = 5;
    timerIcon.position.y = 22;

    gameContainer.addChild( timerIcon );

    timerText = new PIXI.Text(timer, {font:'55px Helvetica', fill:'#f1e408', align:'center', stroke: '#333', strokeThickness: 2});

    timerText.position.x = 55;
    timerText.position.y = 10;

    gameContainer.addChild(timerText);

    // Score

    scoreText = new PIXI.Text(score, {font:'55px Helvetica', fill:'#f1e408', align:'center', stroke: '#333', strokeThickness: 2});

    scoreText.anchor.x = 1;

    scoreText.position.x = DEFAULT_WIDTH - 10;
    scoreText.position.y = 10;

    gameContainer.addChild(scoreText);

    // Santa

    santa = new PIXI.Sprite(santaTexture);

    santa.anchor.x = 0;

    santa.position.x = -SANTA_BUFFER_LEFT;
    santa.position.y = 50;

    gameContainer.addChild(santa);

    // Mince pie

    mincePie = new PIXI.Sprite(mincePieTexture);

    mincePie.interactive = true;

    mincePie.anchor.x = 0.5;
    mincePie.anchor.y = 0.5;

    mincePie.position.x = (DEFAULT_WIDTH / 2);
    mincePie.position.y = DEFAULT_HEIGHT - MINCE_PIE_HEIGHT/2 - 50;

    mincePieOrigX = mincePie.position.x;
    mincePieOrigY = mincePie.position.y;

    gameContainer.addChild(mincePie);

    stage.addChild(gameContainer);

}

function initResultScene() {

    var resultContainer = sceneContainers.result;

    // Score

    var youScored = new PIXI.Text('You scored', {font:'40px Helvetica', fill:'#ffffff', align:'center', stroke: '#333', strokeThickness: 2});

    youScored.anchor.x = 0.5;

    youScored.position.x = DEFAULT_WIDTH / 2;
    youScored.position.y = 20;

    resultContainer.addChild(youScored);

    scoreResultText = new PIXI.Text(score, {font:'80px Helvetica', fill:'#f1e408', align:'center', stroke: '#333', strokeThickness: 2});

    scoreResultText.anchor.x = 0.5;

    scoreResultText.position.x = DEFAULT_WIDTH / 2;
    scoreResultText.position.y = youScored.position.y + youScored.height + 40;

    resultContainer.addChild(scoreResultText);

    // Win text

    var winText1 = new PIXI.Text('You did it! So here\'s a special \nChristmas message from me:', {font:'25px Helvetica', fill:'#ffffff', align:'center', stroke: '#333', strokeThickness: 1});

    winText1.anchor.x = 0.5;
    winText1.position.x = DEFAULT_WIDTH / 2;
    winText1.position.y = scoreResultText.position.y + scoreResultText.height + 40;

    var winText2 = new PIXI.Text('Wishing you a very \nhappy holiday and \na joyful new year!', {font: '28px Courier', fill:'#f1e408', align: 'center', stroke: '#333', strokeThickness: 1});

    winText2.anchor.x = 0.5;
    winText2.position.x = DEFAULT_WIDTH / 2;
    winText2.position.y = winText1.position.y + winText1.height + 40;

    winText = new PIXI.DisplayObjectContainer();

    winText.addChild( winText1 );
    winText.addChild( winText2 );

    resultContainer.addChild(winText);

    // Lose text

    loseText = new PIXI.Text('...', {font:'25px Helvetica', fill:'#ffffff', align:'center', stroke: '#333', strokeThickness: 1});

    loseText.anchor.x = 0.5;
    loseText.position.x = DEFAULT_WIDTH / 2;
    loseText.position.y = scoreResultText.position.y + scoreResultText.height + 80;

    resultContainer.addChild(loseText);

    // Try again button

    var textureButton = PIXI.Texture.fromImage('img/button-try-again.png');

    tryAgainButton = new PIXI.Sprite(textureButton);
    tryAgainButton.buttonMode = true;

    tryAgainButton.position.x = 10;
    tryAgainButton.position.y = DEFAULT_HEIGHT - 80;

    tryAgainButton.width = DEFAULT_WIDTH - 20;
    tryAgainButton.height = 80;

    // Enable after a second to try to prevent people tapping accidentally if they're continuing to 'fling'
    tryAgainButton.visible = false;
    tryAgainButton.interactive = false;

    resultContainer.addChild(tryAgainButton);

    stage.addChild(resultContainer);

    tryAgainButton.mousedown = tryAgainButton.touchstart = function(data) {
        startGame();
    };

    stage.addChild(resultContainer);

}

function initAudio() {

    var finishedLoading = function(bufferList) {

        audioBufferList = bufferList;

        console.log('Finished loading audio');

    };

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    if( window.AudioContext ) {

        audioContext = new AudioContext();

        var bufferLoader = new BufferLoader(
            audioContext,
            [
                'audio/yum.mp3'
            ],
            finishedLoading
        );

        bufferLoader.load();

    }

}

function initInteractions() {

    mincePie.touchstart = mincePie.mousedown = function(data){

        mincePieBeingDragged = true;

        mincePieThrowStartX = data.originalEvent.clientX || data.global.x;
        mincePieThrowStartY = data.originalEvent.clientY || data.global.y;

    };

    mincePie.touchmove = mincePie.mousemove = function(data) {

        if( mincePieBeingDragged ) {

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

    mincePie.mouseup = mincePie.touchend = mincePie.mouseupoutside = mincePie.touchendoutside = function(data) {

        if( mincePieBeingDragged ) {

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

function startGame() {

    // Reset everything

    santaSpeed = SANTA_START_SPEED;

    score = 0;
    scoreText.setText(score);

    timerIcon.setTexture(timerOKTexture);
    timerText.tint = 0xFFFFFF;

    if( timerTimeout ) {
        clearTimeout(timerTimeout);
    }

    timer = TIME_PER_GAME;
    timerText.setText(timer);

    tryAgainButton.visible = false;
    tryAgainButton.interactive = false;

    // Switch to game scene

    switchScene('game');

    // Start the timer...

    timerTimeout = setTimeout(onTimerTick, 1000);

}

function onTimerTick() {

    if( timer < 1 ) {

        endGame();

    } else {

        timer--;

        timerText.setText(timer);

        if( timer <= TIMER_WARN_THRESHOLD ) {
            timerIcon.setTexture(timerWarnTexture);
            timerText.tint = 0xf13d08;
        }

        santaSpeed += SANTA_ACCELERATION;

        clearTimeout(timerTimeout);
        timerTimeout = setTimeout(onTimerTick, 1000);

    }

}

function endGame() {

    clearTimeout(timerTimeout);

    scoreResultText.setText(score);

    if( score >= SCORE_WIN_THRESHOLD ) {

        winText.visible = true;
        loseText.visible = false;

    } else {

        winText.visible = false;
        loseText.setText( 'Good try! Score ' + (SCORE_WIN_THRESHOLD - score) + ' more \nto unlock a special message!' );
        loseText.visible = true;

    }

    setTimeout(function() {
        tryAgainButton.visible = true;
        tryAgainButton.interactive = true;
    }, 2000);

    switchScene('result');


}

function updateSantaPosition() {

    if( santaDirection == DIRECTION.RIGHT ) {

        if( santa.position.x < DEFAULT_WIDTH - SANTA_SIZE + SANTA_BUFFER_RIGHT ) {
            santa.position.x += santaSpeed;
        } else {
            santaDirection = DIRECTION.LEFT;
        }

    } else {

        if( santa.position.x > -SANTA_BUFFER_LEFT ) {
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

            // Collision detection...
            if( mincePie.position.x >= santa.position.x &&
                mincePie.position.x <= santa.position.x + santa.width &&
                mincePie.position.y <= santa.position.y + (santa.height * 3/4) &&
                mincePie.position.y >= santa.position.y ) {

                registerHit();
                endMincePieFling();

            }

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

function registerHit() {

    playYumSound();

    santa.setTexture(santaYumTexture);

    if( textureTimeout ) {
        clearTimeout(textureTimeout);
    }

    textureTimeout = window.setTimeout(function() {
        santa.setTexture(santaTexture);
    }, 500);

    score++;

    scoreText.setText( score );

}

function animate() {

    if( currentScene === 'game' ) {

        updateSantaPosition();
        updateMincePiePosition();

    }

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

function playYumSound() {

    if( !playingSound && audioBufferList && audioBufferList.length > 0 ) {

        playingSound = true;

        // Sound when you hit Santa with mince pie

        audioYum = audioContext.createBufferSource();
        audioYum.buffer = audioBufferList[0];
        audioYum.connect(audioContext.destination);
        audioYum.onended = function() {
            playingSound = false;
        };
        audioYum.start(0);
    }

}