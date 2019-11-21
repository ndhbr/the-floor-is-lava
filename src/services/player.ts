const GRAVITY_Y = 2000;

export class PlayerService {

	player: Phaser.Physics.Arcade.Sprite;
	playerJumps: number;

	startPosition: { x: number; y: number; };

	savedVelocity: number;

	constructor(private scene: Phaser.Scene) {
		this.savedVelocity = 0;

		this.startPosition = {
			x: 50,
			y: this.scene.physics.world.bounds.centerY + 64
		};
	}

	pauseGame(pause?: boolean) {
		if (pause == null)
			pause = false;

		if (pause) {
			this.savedVelocity = this.player.body.velocity.y;

			this.player.anims.pause();
			this.player.setGravityY(0);
			this.player.setVelocityY(0);
		} else {
			this.player.anims.resume();
			this.player.setGravityY(GRAVITY_Y);
			this.player.setVelocityY(this.savedVelocity);
			this.savedVelocity = 0;
		}
	}

	addPlayer() {
		this.player = this.scene.physics.add.sprite(
			this.startPosition.x,
			this.startPosition.y,
			'player'
		);
		this.player.depth = 2;
		// this.player.setBounceY(1);

		this.scene.anims.create({
			key: 'run',
			frames: this.scene.anims.generateFrameNumbers('player', {start: 0, end: 7}),
			frameRate: 10,
			repeat: -1
		});

		this.scene.anims.play('run', this.player);

		this.player.setGravityY(GRAVITY_Y);
	}

	resetPosition() {
		this.player.setVelocity(0, 0);

		this.player.setPosition(
			this.startPosition.x,
			this.startPosition.y
		);
	}

	jump() {
		if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < 3)) {
			if (this.player.body.touching.down)
				this.playerJumps = 0;

			if (this.playerJumps < 2) {
				this.player.setVelocityY(-600);
			} else {
				this.player.setVelocityY(-1200);
			}

			this.playerJumps++;
		}
	}

	animate() {}

	getPlayer(): Phaser.Physics.Arcade.Sprite {
		return this.player;
	}

	getBounds() {
		return this.player.getBounds();
	}

	setPlayerJumps(value?: number) {
		if (!value)
			value = 0;

		this.playerJumps = value;
	}

	getPlayerJumps() {
		return this.playerJumps;
	}
}