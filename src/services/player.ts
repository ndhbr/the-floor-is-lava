export class PlayerService {

	player: Phaser.Physics.Arcade.Sprite;
	playerJumps: number;

	startPosition: { x: number; y: number; };

	constructor(private scene: Phaser.Scene) {
		this.startPosition = {
			x: 50,
			y: this.scene.physics.world.bounds.centerY + 200
		};
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

		this.player.setGravityY(2000);
	}

	jump() {
		if (this.player.body.touching.down) {
			this.player.setVelocityY(-600);
		}

		this.playerJumps++;
	}

	resetPosition() {
		this.player.setVelocity(0, 0);
		this.player.setPosition(this.startPosition.x, this.startPosition.y);
	}

	animate() {
		this.player.anims.play('run', true);
	}

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