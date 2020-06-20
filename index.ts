import Phaser from "phaser";
import * as scene from "./scene";

export const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: innerWidth,
    height: innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 600},
            debug: false
        }
    },
    scene
});