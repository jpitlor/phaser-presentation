import sky from "../assets/sky.png";
import platform from "../assets/platform.png";
import playerSprite from "../assets/player.png";
import red from "../assets/red.png";
import orange from "../assets/orange.png";
import yellow from "../assets/yellow.png";
import green from "../assets/green.png";
import blue from "../assets/blue.png";
import purple from "../assets/purple.png";

interface Wasd {
    up: Phaser.Input.Keyboard.Key,
    down: Phaser.Input.Keyboard.Key,
    left: Phaser.Input.Keyboard.Key,
    right: Phaser.Input.Keyboard.Key
}

let platforms: Phaser.Physics.Arcade.StaticGroup
    ,player: Phaser.Physics.Arcade.Sprite
    ,wasd: Wasd
    ,arrows: Phaser.Types.Input.Keyboard.CursorKeys

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('sky', sky);
        this.load.image('ground', platform);
        this.load.image('red', red);
        this.load.image('orange', orange);
        this.load.image('yellow', yellow);
        this.load.image('green', green);
        this.load.image('blue', blue);
        this.load.image('purple', purple);
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

        arrows = this.input.keyboard.createCursorKeys(),
        wasd = this.input.keyboard.addKeys({ 
            up: Phaser.Input.Keyboard.KeyCodes.W, 
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        }) as Wasd;
    }

    update() {
        if (arrows.left?.isDown || wasd.left?.isDown) {
            player.setVelocityX(-250);
            player.anims.play('left', true);
        } else if (arrows.right?.isDown || wasd.right?.isDown) {
            player.setVelocityX(250);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (this.input.manager.pointers[0].leftButtonDown()) {

        } else if (this.input.manager.pointers[0].rightButtonDown()) {
            
        }

        if ((arrows.up?.isDown || wasd.up?.isDown) && player.body.touching.down) {
            player.setVelocityY(-1000);
        }
    }
}