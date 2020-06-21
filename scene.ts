import sky from './assets/sky.png';
import playerSprite from './assets/player.png';
import red from './assets/red.png';
import orange from './assets/orange.png';
import yellow from './assets/yellow.png';
import green from './assets/green.png';
import blue from './assets/blue.png';
import purple from './assets/purple.png';
import activeItemImage from './assets/active-item.png';

interface Keys {
    [k: string]: Phaser.Input.Keyboard.Key;
}

let blocks: Phaser.Physics.Arcade.StaticGroup
    ,player: Phaser.Physics.Arcade.Sprite
    ,keys: Keys
    ,arrows: Phaser.Types.Input.Keyboard.CursorKeys
    ,activeItemFrame: Phaser.GameObjects.Image

const inventory = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple'
];
let activeItem = 0;
let clicked = false;

function toRight(player: Phaser.Physics.Arcade.Sprite): number {
    const rightEdge = player.x + player.width;
    return (rightEdge + (64 - rightEdge % 64)) + 32;
}

function toLeft(player: Phaser.Physics.Arcade.Sprite): number {
    return (player.x - (player.x % 64)) - 64 + 32;
}

function toUp(player: Phaser.Physics.Arcade.Sprite): number {
    return (player.y - (player.y % 64)) - 64 + 32;
}

function toDown(player: Phaser.Physics.Arcade.Sprite): number {
    const bottomEdge = player.y + player.height;
    return (bottomEdge + (64 - bottomEdge % 64)) + 32;
}

export default class Scene extends Phaser.Scene {
    preload() {
        this.load.image('sky', sky);
        this.load.image('red', red);
        this.load.image('orange', orange);
        this.load.image('yellow', yellow);
        this.load.image('green', green);
        this.load.image('blue', blue);
        this.load.image('purple', purple);
        this.load.image('activeItem', activeItemImage);
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

        blocks = this.physics.add.staticGroup();

        player = this.physics.add.sprite(100, 100, 'player');
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
        this.physics.add.collider(player, blocks);

        arrows = this.input.keyboard.createCursorKeys(),
        keys = this.input.keyboard.addKeys({ 
            up: Phaser.Input.Keyboard.KeyCodes.W, 
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        }) as Keys;

        const startX = (innerWidth / 2) - (64 * inventory.length / 2);
        inventory.forEach((item, i) => {
            this.add.image(startX + i * 64, 64, item);
        });

        activeItemFrame = this.add.image(startX, 64, 'activeItem');
    }

    update() {
        if (arrows.left?.isDown || keys.left?.isDown) {
            player.setVelocityX(-250);
            player.anims.play('left', true);
        } else if (arrows.right?.isDown || keys.right?.isDown) {
            player.setVelocityX(250);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if ((arrows.up?.isDown || keys.up?.isDown) && player.body.blocked.down) {
            player.setVelocityY(-1000);
        }

        const children = blocks.getChildren();
        const targetX = toRight(player);
        const targetY = (player.y - (player.y % 64)) + 16;
        const targetBlock = children.find(c => 
            (c.body as Phaser.Physics.Arcade.Body).position.x + 32 === targetX &&
            (c.body as Phaser.Physics.Arcade.Body).position.y + 32 === targetY
        );
        if (this.input.manager.activePointer.leftButtonDown()) {
            if (targetBlock && !clicked) targetBlock.destroy();
            clicked = true;
        } else if (this.input.manager.activePointer.rightButtonDown()) {
            const anchorBlock = children.find(c => 
                (c.body as Phaser.Physics.Arcade.Body).position.x + 32 === targetX &&
                (c.body as Phaser.Physics.Arcade.Body).position.y + 32 === targetY + 64
            );
            if (!targetBlock && !clicked && (targetY + 64 > innerHeight || !!anchorBlock)) blocks.create(targetX, targetY, inventory[activeItem]);
            clicked = true;
        } else {
            clicked = false;
        }

        if (this.input.manager.activePointer.deltaY > 0) {
            activeItem = (activeItem + 1) % inventory.length;
        } else if (this.input.manager.activePointer.deltaY < 0) {
            activeItem = activeItem ? activeItem - 1 : inventory.length - 1;
        }
        this.input.manager.activePointer.deltaY = 0;

        const startX = (innerWidth / 2) - (64 * inventory.length / 2);
        activeItemFrame.setX(startX + activeItem * 64);
    }
}