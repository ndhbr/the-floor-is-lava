import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {

	backgroundLivingRoom: Phaser.GameObjects.TileSprite;
	backgroundBasement: Phaser.GameObjects.TileSprite;

	platformGroup: Phaser.GameObjects.Group;
	platformPool: Phaser.GameObjects.Group;
	nextPlatformDistance: number;

	startPlatform: Phaser.GameObjects.TileSprite | any;

	player: Phaser.Physics.Arcade.Sprite;
	playerJumps: number;

	lava: Phaser.Physics.Arcade.StaticGroup;
	lavaParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
	lavaParticlesPositonX: number;

	gameOver: boolean;

	space: Phaser.Input.Keyboard.Key;

	score: number;
	scoreText: Phaser.GameObjects.Text;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
		this.score = 0;
	}

    public preload(): void {
		// this.load.spritesheet('player',
		// 	'assets/walking-12px-without-border.png',
		// 	{ frameWidth: 12, frameHeight: 12 });

		this.load.spritesheet('player', 'assets/player.png',
			{ frameWidth: 64, frameHeight: 64 });

		this.load.spritesheet('lava',
			'assets/lava-45px.png',
			{ frameWidth: 45, frameHeight: 16 });

		this.load.image('particle', 'assets/particle.png');

		this.load.image('platform', 'assets/new-platform.png');
		this.load.image('crate', 'assets/crate.png');
		this.load.image('table', 'assets/table.png');
		this.load.image('floor', 'assets/floor.png');
		this.load.image('cobblestone', 'assets/cobblestone.png');
		this.load.image('wood', 'assets/wood.png');
		this.load.image('startPlatform', 'assets/start-platform.png');
	}

    public create(): void {
		this.addBackgrounds();

		this.addLavaParticles();

		this.platformGroup = this.add.group({
			removeCallback: (platform) => {
				this.platformPool.add(platform);
			}
		});

		this.platformPool = this.add.group({
			removeCallback: (platform) => {
				this.platformGroup.add(platform);
			}
		});

		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers('player', {start: 0, end: 7}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'lava',
			frames: this.anims.generateFrameNumbers('lava', {start: 0, end: 15}),
			frameRate: 10,
			repeat: -1
		});

		this.lava = this.physics.add.staticGroup();
		let neededLava = Math.round(this.physics.world.bounds.width / 45) + 1;
		for(let i = 0; i < neededLava; i++) {
			let lavaTile = this.physics.add.sprite(45 * i,
				this.physics.world.bounds.bottom - 4,
				'lava'
			);
			this.lava.add(lavaTile);
		}
		this.lava.playAnimation('lava');

		this.playerJumps = 0;

		this.addStartPlatform();

		this.player = this.physics.add.sprite(50, this.physics.world.bounds.centerY + 200, 'player');
		this.player.setGravityY(2000);
		// this.player.setScale(4);

		this.physics.add.collider(this.player, this.platformGroup, this.setFriction, null, this);
		this.physics.add.collider(this.player, this.startPlatform, this.setFriction, null, this);

		this.input.on('pointerdown', this.jump, this);
		this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, true);

		this.nextPlatformDistance = Phaser.Math.Between(50, 200);

		this.addScoreText();
		this.addFloors();
	}

    public update(time: number): void {
		if(!this.gameOver) {
			if (this.player.y > this.physics.world.bounds.bottom) {
				this.setGameOver(true);
			}

			if (this.space.isDown) {
				this.jump();
			}

			this.player.anims.play('run', true);

			let minDistance = this.physics.world.bounds.width;
			this.platformGroup.getChildren().forEach((platform: Phaser.Physics.Arcade.Sprite) => {
				let platformDistance = this.physics.world.bounds.width - platform.x - platform.displayWidth / 2;

				minDistance = Math.min(minDistance, platformDistance);

				if (platform.x < -platform.displayWidth / 2) {
					this.platformGroup.killAndHide(platform);
					this.platformGroup.remove(platform);
				}
			}, this);

			if (minDistance > this.nextPlatformDistance && !this.checkStartPlatform()) {

				this.addPlatform(128, this.physics.world.bounds.width + 64);
				// let nextPlatformWidth = Phaser.Math.Between(100, 250);
				// this.addPlatform(nextPlatformWidth, this.physics.world.bounds.width + nextPlatformWidth / 2);
			}

			this.checkStartPlatform();
			this.updateLavaParticles();
			this.updateScoreText(++this.score);
			this.backgroundBasement.tilePositionX += 1;
		} else {
			this.updateScoreText(-1);

			this.player.setVelocity(0, 0);
			this.player.setPosition(50, this.physics.world.bounds.centerY + 200);

			this.addStartPlatform();

			this.setGameOver(false);
		}
	}

	private addPlatform(platformWidth: number, positionX: number) {
		let platform: Phaser.GameObjects.TileSprite & any;

		if (this.platformPool.getLength()) {
			platform = this.platformPool.getFirst();

			platform.setX(positionX);
			platform.setActive(true);
			platform.setVisible(true);

			this.platformPool.remove(platform);
		} else {
			platform = this.physics.add.sprite(positionX, this.physics.world.bounds.bottom - 16, 'table');
			platform.setImmovable(true);
			platform.setVelocityX(-350);
			// platform = this.add.tileSprite(
			// 	positionX,
			// 	this.physics.world.bounds.bottom - 16,
			// 	platformWidth,
			// 	32,
			// 	'table'
			// );

			// this.physics.add.existing(platform);

			// let body: Phaser.Physics.Arcade.Body = platform.body;
			// body.setEnable(true);
			// body.setImmovable(true);
			// body.setVelocityX(-350);

			this.platformGroup.add(platform);
		}

		platform.displayWidth = platformWidth;
		this.nextPlatformDistance = Phaser.Math.Between(50, 100);
	}

	private addLavaParticles() {
		this.lavaParticles = this.add.particles('particle');
		this.lavaParticlesPositonX = this.physics.world.bounds.width + 100;

		this.lavaParticles.createEmitter({
			x: 0,
			y: this.physics.world.bounds.bottom - 10,
			speed: 50,
			angle: { min: 180, max: 360 },
			scale: { start: 1, end: 0.1 },
			gravityX: 10,
			lifespan: 2000
		});
	}

	private addBackgrounds() {
		this.backgroundBasement = this.add.tileSprite(
			0,
			(this.physics.world.bounds.height / 3) * 2,
			this.physics.world.bounds.width,
			this.physics.world.bounds.height / 3,
			'cobblestone'
		);

		this.backgroundLivingRoom = this.add.tileSprite(
			0,
			(this.physics.world.bounds.height / 3),
			this.physics.world.bounds.width,
			this.physics.world.bounds.height / 3,
			'wood'
		);

		this.backgroundBasement.setOrigin(0, 0);
		this.backgroundLivingRoom.setOrigin(0, 0);
	}

	private addStartPlatform() {
		if (this.startPlatform == null) {
			this.startPlatform = this.add.tileSprite(
				this.physics.world.bounds.centerX,
				this.physics.world.bounds.bottom - 16,
				this.physics.world.bounds.width,
				32,
				'startPlatform'
			);

			this.physics.add.existing(this.startPlatform);

			let body: Phaser.Physics.Arcade.Body = this.startPlatform.body;

			body.setEnable();
			body.setImmovable(true);
			body.setVelocityX(-350);
		} else {
			this.startPlatform.setX(this.physics.world.bounds.centerX);
			this.startPlatform.setActive(true);
			this.startPlatform.setVisible(true);
		}
	}

	private checkStartPlatform() {
		if (this.startPlatform.x < - this.startPlatform.width / 2) {
			this.startPlatform.setActive(false);
			this.startPlatform.setVisible(false);

			return false;
		}

		return true;
	}

	private updateLavaParticles() {
		this.lavaParticlesPositonX -= 1;
		this.lavaParticles.setX(this.lavaParticlesPositonX);

		if(this.lavaParticlesPositonX < this.physics.world.bounds.left - 100)
			this.lavaParticlesPositonX = this.physics.world.bounds.width + 100;
	}

	private addScoreText() {
		this.scoreText = this.add.text(
			this.physics.world.bounds.centerX,
			30,
			null,
			{
				fontFamily: '"Roboto Condensed", sans-serif',
				fontSize: '30px'
			}
		);

		this.scoreText.setOrigin(0.5, 0.5);

		this.updateScoreText();
	}

	private updateScoreText(newScore?: number) {
		if (newScore)
			this.score = newScore;

		this.scoreText.setText(this.score + ' m');
	}

	private addFloors() {
		this.add.tileSprite(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.height / 3,
			this.physics.world.bounds.width,
			32,
			'crate'
		);

		this.add.tileSprite(
			this.physics.world.bounds.centerX,
			(this.physics.world.bounds.height / 3) * 2,
			this.physics.world.bounds.width,
			32,
			'crate'
		);
	}

	private setFriction(player: Phaser.Physics.Arcade.Sprite, platform: any) {
		player.body.x -= platform.body.x - platform.body.prev.x;
	}

	private jump() {
		if (this.player.body.touching.down) {
			this.player.setVelocityY(-600);
		}

		this.playerJumps++;
	}

	private setGameOver(gameOver: boolean) {
		this.gameOver = gameOver;
	}
}