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
console.log('helloworld');
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

    }
    update() {

    }
}