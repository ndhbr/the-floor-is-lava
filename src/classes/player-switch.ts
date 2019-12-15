enum Direction {
	LEFT,
	RIGHT
}

enum PlayerNames {
	__START,
	Lion,
	Crocodile,
	__END
}

export class PlayerSwitch extends Phaser.GameObjects.Container {

	players: Array<Phaser.Physics.Arcade.Sprite>;
	activePlayer: PlayerNames;

	particles: Phaser.GameObjects.Particles.ParticleEmitterManager;

	constructor(scene: Phaser.Scene) {
		super(
			scene,
			scene.physics.world.bounds.centerX,
			scene.physics.world.bounds.centerY
		);

		scene.add.existing(this);
		this.addParticles();
		this.addPlayer();
	}

	public getSelectedSprite(): Phaser.Physics.Arcade.Sprite {
		return this.players[this.activePlayer];
	}

	public getSelectedSpriteKey(): string {
		return this.players[this.activePlayer].texture.key;
	}

	private addPlayer() {
		this.setDepth(4);

		this.players = [];

		const left = this.addControl(Direction.LEFT);
		const right = this.addControl(Direction.RIGHT);

		left.on('pointerdown', () => {
			this.drawPlayer(Direction.LEFT);
		});

		right.on('pointerdown', () => {
			this.drawPlayer(Direction.RIGHT)
		});

		this.drawPlayer();

		this.add(left);
		this.add(right);
	}

	private drawPlayer(direction?: Direction) {
		if (this.activePlayer == null) {
			this.activePlayer = PlayerNames.Crocodile;
		}

		if (direction != null) {
			if (this.players[this.activePlayer] != null) {
				this.players[this.activePlayer].setActive(false);
				this.players[this.activePlayer].setVisible(false);
			}

			if (Direction.LEFT)
				this.activePlayer--;
			else if (Direction.RIGHT)
				this.activePlayer++;

			if (this.activePlayer === PlayerNames.__START)
				this.activePlayer = PlayerNames.__END - 1;

			if (this.activePlayer === PlayerNames.__END)
				this.activePlayer = PlayerNames.__START + 1;
		}

		if (this.players[this.activePlayer] == null) {
			this.players[this.activePlayer] = this.scene.physics.add.sprite(
				0,
				0,
				`player${PlayerNames[this.activePlayer]}`,
				11
			);

			this.add(this.players[this.activePlayer]);
		} else {
			this.players[this.activePlayer].setActive(true);
			this.players[this.activePlayer].setVisible(true);
		}

		this.players[this.activePlayer].anims.play(`standing-player${PlayerNames[this.activePlayer]}`);
	}

	private addControl(type: Direction): Phaser.GameObjects.Sprite {
		let control: Phaser.GameObjects.Sprite;

		if (type === Direction.LEFT) {
			control = this.scene.add.sprite(
				-96,
				0,
				'triangle'
			);
			control.flipX = true;
		} else {
			control = this.scene.add.sprite(
				96,
				0,
				'triangle'
			);
		}

		control.setInteractive();

		return control;
	}

	private addParticles() {
		this.particles = this.scene.add.particles('particle');
		this.particles.createEmitter({
			x: 0,
			y: 0,
			gravityY: -10,
			speed: 30,
			scale: { start: 1, end: 0.1 },
			lifespan: 3000
		});

		this.add(this.particles);
	}
}