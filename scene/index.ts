import inputProxy from "./input";

import sky from "../assets/sky.png";
import platform from "../assets/platform.png";
import playerSprite from "../assets/player.png";


let platforms, player, input;

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('sky', sky);
        this.load.image('ground', platform);
        this.load.spritesheet(
            'player',
            playerSprite,
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.add
            .image(0, 0, 'sky')
            .setOrigin(0, 0)
            .setScale(Math.ceil(innerWidth / 800), Math.ceil(innerHeight / 600));

        platforms = this.physics.add.staticGroup();
        platforms
            .create(0, innerHeight - 32, 'ground')
            .setOrigin(0, 0)
            .setScale(Math.ceil(innerWidth / 400), 1)
            .refreshBody();

        player = this.physics.add.sprite(100, innerHeight - 56, 'player');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.physics.add.collider(player, platforms);

        input = inputProxy([
            this.input.keyboard.createCursorKeys(),
            this.input.keyboard.addKeys({ 
                up: Phaser.Input.Keyboard.KeyCodes.W, 
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D
            })
        ]);
    }

    update() {
        if (input.left) {
            player.setVelocityX(-250);
            player.anims.play('left', true);
        } else if (input.right) {
            player.setVelocityX(250);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (input.up && player.body.touching.down) {
            player.setVelocityY(-600);
        }
    }
}