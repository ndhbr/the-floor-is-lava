import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'PauseMenu',
};

export class PauseMenuScene extends Phaser.Scene {

	heading: Phaser.GameObjects.Text;
	backdrop: Phaser.GameObjects.Rectangle;

	resumeButton: Phaser.GameObjects.Container;

	constructor() {
        super(sceneConfig);
	}

	public init(): void {}

	public preload(): void {
		console.log('Preload');

		this.load.spritesheet('button-green', 'assets/buttons-green.png',
			{ frameWidth: 240, frameHeight: 60 });
		this.load.spritesheet('button-red', 'assets/buttons-red.png',
			{ frameWidth: 240, frameHeight: 60 });
	}

	public create(): void {
		this.backdrop = this.add.rectangle(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY,
			this.physics.world.bounds.width,
			this.physics.world.bounds.height,
			0x000000,
			0.9
		);

		this.heading = this.add.text(
			this.physics.world.bounds.centerX,
			100,
			'Pause', {
				fontFamily: 'Roboto, Calibri, sans-serif'
			}
		);
		this.heading.setOrigin(0.5, 0.5);

		this.resumeButton = this.add.container(
			this.physics.world.bounds.centerX,
			200,
		);

		let buttonBg = this.add.sprite(
			0,
			0,
			'button-red',
			0
		);
		buttonBg.setInteractive();
		buttonBg.on('pointerdown', () => {
			buttonBg.setFrame(1);
		}, this);
		buttonBg.on('pointerup', () => {
			buttonBg.setFrame(0);
			this.scene.stop();
			this.scene.resume('Game');
		});

		let buttonText = this.add.text(
			0, 0, 'Resume', {
				fontFamily: 'Roboto, Calibri, sans-serif'
			}
		);
		buttonText.setOrigin(0.5, 0.5);

		this.resumeButton.add(buttonBg);
		this.resumeButton.add(buttonText);
	}

	public update(time: number): void {}
}