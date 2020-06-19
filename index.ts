import Phaser from "phaser";
import * as scene from "./scene";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene
});