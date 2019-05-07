let game;
let gameOptions = {

    // bird gravity, will make bird fall if you dont flap
    birdGravity: 800,

    // horizontal bird speed
    birdSpeed: 125,

    // flap thrust
    birdFlapPower: 300,

    // minimum pipe height, in pixels. Affects hole position
    minPipeHeight: 50,

    // distance range from next pipe, in pixels
    pipeDistance: [220, 280],

    // hole range between pipes, in pixels
    pipeHole: [100, 130],

    // local storage object name
    localStorageName: 'bestFlappyScore'
};
window.onload = function () {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x87ceeb,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            // parent: 'thegame',
            width: 320,
            height: 480
        },
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
class playGame extends Phaser.Scene {
    constructor() {
        super('PlayGame');
    }
    preload() {
        this.load.image('bird', 'bird.png');
        this.load.image('pipe', 'pipe.png');
    }
    create() {
        // making the pipegroup
        this.pipeGroup = this.physics.add.group()
        this.pipePool = [];
        for (let i = 0; i < 4; i++) {
            this.pipePool.push(this.pipeGroup.create(0,0,'pipe'))
            this.pipePool.push(this.pipeGroup.create(0,0,'pipe'))
            this.placePipes(false)
        }
        this.pipeGroup.setVelocityX(-gameOptions.birdSpeed)
        // making bird
        this.bird = this.physics.add.sprite(80, game.config.height / 2, 'bird');
        this.bird.body.gravity.y = gameOptions.birdGravity;
        // inputs
        this.input.on('pointerdown',this.flap,this)
        this.score = 0;
        this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);
        this.scoreText = this.add.text(10, 10, '');
        this.updateScore(this.score);
    }
    updateScore(inc) {
        this.score += inc;
        this.scoreText.text = 'Score: ' + this.score + '\nBest: ' + this.topScore;
    }
    update() {
        this.physics.world.collide(this.bird, this.pipeGroup, function () {
            this.die();
        }, null, this);
        if (this.bird.y > game.config.height || this.bird.y < 0) {
            this.die();
        }
        this.pipeGroup.getChildren().forEach(function (pipe) {
            if (pipe.getBounds().right < 0) {
                this.pipePool.push(pipe);
                if (this.pipePool.length == 2) {
                    this.placePipes(true);
                }
            }
        }, this)
    }
    flap() {
        this.bird.body.velocity.y = -gameOptions.birdFlapPower
        // this.bird.body.velocity.x = 2
    }
    // making pipes
    placePipes(addScore) {
        let rightmost = this.getRightmostPipe();
        let pipeHoleHeight = Phaser.Math.Between(gameOptions.pipeHole[0], gameOptions.pipeHole[1]);
        let pipeHolePosition = Phaser.Math.Between(gameOptions.minPipeHeight + pipeHoleHeight / 2, game.config.height - gameOptions.minPipeHeight - pipeHoleHeight / 2);
        this.pipePool[0].x = rightmost + this.pipePool[0].getBounds().width + Phaser.Math.Between(gameOptions.pipeDistance[0], gameOptions.pipeDistance[1]);
        this.pipePool[0].y = pipeHolePosition - pipeHoleHeight / 2;
        this.pipePool[0].setOrigin(0, 1);
        this.pipePool[1].x = this.pipePool[0].x;
        this.pipePool[1].y = pipeHolePosition + pipeHoleHeight / 2;
        this.pipePool[1].setOrigin(0, 0);
        this.pipePool = [];
        if (addScore) {
            this.updateScore(1);
        }
    }
    getRightmostPipe() {
        let rightmostPipe = 0;
        this.pipeGroup.getChildren().forEach(function (pipe) {
            rightmostPipe = Math.max(rightmostPipe, pipe.x);
        });
        return rightmostPipe;
    }
    die() {
        localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
        this.scene.start('PlayGame');
    }
}