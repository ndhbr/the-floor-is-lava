const GRAVITY_Y = 2000;

export class PlayerService {

	player: Phaser.Physics.Arcade.Sprite;
	playerJumps: number;
	doubleJumpAllowed: boolean;

	startPosition: { x: number; y: number; };

	savedVelocity: number;

	constructor(private scene: Phaser.Scene) {
		this.savedVelocity = 0;

		this.startPosition = {
			x: 50,
			y: this.scene.physics.world.bounds.centerY + 64
		};

		this.doubleJumpAllowed = true;
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

		this.scene.anims.create({
			key: 'run',
			frames: this.scene.anims.generateFrameNumbers('player', {start: 0, end: 7}),
			frameRate: 10,
			repeat: -1
		});

		this.scene.anims.play('run', this.player);

		this.player.setGravityY(GRAVITY_Y);
	}

	jump() {
		if (this.player.anims.isPlaying) {
			if (this.player.body.touching.down) {
				this.player.setVelocityY(-600);
			} else if (this.doubleJumpAllowed) {
				this.player.setVelocityY(-600);
				this.doubleJumpAllowed = false;
			}

			this.playerJumps++;
		}
	}

	resetPosition() {
		this.player.setVelocity(0, 0);
		this.player.setPosition(this.startPosition.x, this.startPosition.y);
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

	enableDoubleJump(): boolean {
		if (this.player.body.touching.down) {
			this.doubleJumpAllowed = true;
			return true;
		}

		return false;
	}

	getPlayerJumps() {
		return this.playerJumps;
	}
}