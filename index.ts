import Phaser from "phaser";
import scene from "./scene";

export const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: innerWidth,
    height: innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 4000},
            debug: false
        }
    },
    input: {
        activePointers: 1
    },
    scene
});

document.oncontextmenu = e => e.preventDefault();