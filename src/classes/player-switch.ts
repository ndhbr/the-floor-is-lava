import { DefaultText } from "./default-text";

enum Direction {
	LEFT,
	RIGHT
}

enum PlayerNames {
	__START,
	Lion,
	Crocodile,
	Ninja,
	__END
}

export class PlayerSwitch extends Phaser.GameObjects.Container {

	highscore: number;
	highscoreText: DefaultText;

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
		if (this.players[this.activePlayer].isTinted)
			return this.players[1].texture.key;

		return this.players[this.activePlayer].texture.key;
	}

	public addHighscore(score: number) {
		this.highscore = score;
	}

	private addPlayer() {
		this.setDepth(4);

		this.players = [];

		const left = this.addControl(Direction.LEFT);
		const right = this.addControl(Direction.RIGHT);

		left.on('pointerdown', () => {
			this.scene.sound.play('menuSelect');
			this.drawPlayer(Direction.LEFT);
		});

		right.on('pointerdown', () => {
			this.scene.sound.play('menuSelect');
			this.drawPlayer(Direction.RIGHT);
		});

		this.drawPlayer();

		this.add(left);
		this.add(right);
	}

	private lockPlayer(playerName: PlayerNames): number {
		const color = 0x666666;

		if (this.highscore == null) {
			let i: number;

			for (i = 2; i < this.players.length + 1; i++) {
				if (this.players[i] != null)
					this.players[i].setTint(color);
			}

			return -1;
		} else {
			switch (playerName) {
				case PlayerNames.Crocodile:
					if (this.highscore < 2000) {
						this.players[PlayerNames.Crocodile].setTint(color);

						return 2000;
					}

					return -1;
				case PlayerNames.Ninja:
					if (this.highscore < 5000) {
						this.players[PlayerNames.Ninja].setTint(color);

						return 5000;
					}

					return -1;
			}
		}
	}

	private drawPlayer(direction?: Direction) {
		if (this.activePlayer == null) {
			this.activePlayer = PlayerNames.Lion;
		}

		if (direction != null) {
			if (this.players[this.activePlayer] != null) {
				this.players[this.activePlayer].setActive(false);
				this.players[this.activePlayer].setVisible(false);
			}

			if (direction == Direction.LEFT) {
				this.activePlayer--;

				if (this.activePlayer === PlayerNames.__START)
					this.activePlayer = PlayerNames.__END - 1;
			} else if (direction == Direction.RIGHT) {
				this.activePlayer++;

				if (this.activePlayer === PlayerNames.__END)
					this.activePlayer = PlayerNames.__START + 1;
			}
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

		const highscoreNeeded = this.lockPlayer(this.activePlayer);

		if (this.players[this.activePlayer].isTinted) {
			this.addHighscoreText(highscoreNeeded);
		} else {
			this.removeHighscoreText();
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
		control.input.hitArea.setTo(
			-50,
			-50,
			100,
			100
		);

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

	private removeHighscoreText() {
		if (this.highscoreText != null) {
			this.highscoreText.destroy();
		}
	}

	private addHighscoreText(scoreNeeded: number) {
		let text = `Du brauchst mehr Punkte!`;

		if(scoreNeeded > -1) {
			text = `Schaffe ${scoreNeeded}m, um diesen Spieler freizuschalten!`;
		}

		if (this.highscoreText != null)
			this.highscoreText.destroy();

		this.highscoreText = new DefaultText(
			this.scene,
			0,
			80,
			text,
			24,
			1
		);

		this.highscoreText.setMaxWidth(this.scene.physics.world.bounds.width - 50);
		this.highscoreText.setOrigin(0.5, 0.5);
		this.add(this.highscoreText);
	}
}