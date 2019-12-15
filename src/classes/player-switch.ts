import { DefaultText } from "./default-text";

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

	players: Array<Phaser.GameObjects.Sprite>;
	activePlayer: PlayerNames;
	previewPlayer: Phaser.GameObjects.Sprite;

	constructor(scene: Phaser.Scene) {
		super(
			scene,
			scene.physics.world.bounds.centerX,
			scene.physics.world.bounds.centerY
		);

		this.addPlayer();
		scene.add.existing(this);
	}

	public getSelectedSprite(): Phaser.GameObjects.Sprite {
		return this.players[this.activePlayer];
	}

	private addPlayer() {
		this.setDepth(4);

		this.players = [];

		// player.setDepth(4);
		// player.anims.play('standing');

		const left = this.addControl(Direction.LEFT, () => {
			console.log('Left player');
		});

		const right = this.addControl(Direction.RIGHT, () => {
			console.log('Right player');
		});

		new DefaultText(this.scene, 100, 100, 'Servus', 32).setInteractive().on('pointerdown', () => {
			this.drawPlayer(Direction.LEFT);
		});

		this.drawPlayer();

		// left.setDepth(4);
		this.add(left);
		this.add(right);
		this.setInteractive();
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
			this.players[this.activePlayer] = this.scene.add.sprite(
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

		// this.players[this.activePlayer].play('standing');
	}

	private addControl(type: Direction, callback: () => void)
	: Phaser.GameObjects.Triangle {
		let control: Phaser.GameObjects.Triangle;
		const color: number = 0xffffff;

		if (type === Direction.LEFT) {
			control = this.scene.add.triangle(
				-32,
				0,
				-32,
				-10,
				-32,
				10,
				-48,
				0,
				color
			);
		} else {
			control = this.scene.add.triangle(
				32,
				0,
				32,
				10,
				32,
				-10,
				48,
				0,
				color
			);
		}

		control.setInteractive();
		control.on('pointerdown', () => {
			console.log('test');
		});

		return control;
	}
}