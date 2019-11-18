import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'PauseMenu',
};

export class PauseMenuScene extends Phaser.Scene {

	heading: Phaser.GameObjects.Text;
	backdrop: Phaser.GameObjects.Rectangle;

	buttonService: ButtonService;

	resumeButton: Phaser.GameObjects.Container;
	menuButton: Phaser.GameObjects.Container;

	countdown: NodeJS.Timeout;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.buttonService = new ButtonService(this);
	}

	public preload(): void {
		this.load.spritesheet('button-green', 'assets/buttons-green.png',
			{ frameWidth: 240, frameHeight: 60 });
		this.load.spritesheet('button-red', 'assets/buttons-red.png',
			{ frameWidth: 240, frameHeight: 60 });
		this.load.spritesheet('button-pixel-red', 'assets/buttons-pixel-red.png',
			{ frameWidth: 125, frameHeight: 27 });
	}

	public create(): void {
		this.backdrop = this.add.rectangle(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY,
			this.physics.world.bounds.width,
			this.physics.world.bounds.height,
			0x000000,
			0.6
		);

		this.heading = this.add.text(
			this.physics.world.bounds.centerX,
			100,
			'Pause', {
				fontFamily: 'Roboto, Calibri, sans-serif'
			}
		);
		this.heading.setOrigin(0.5, 0.5);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			200,
			this.resumeButton,
			'button-pixel-red',
			'Resume',
			(button: Phaser.GameObjects.Container) => {
				let textObject = <Phaser.GameObjects.Text> button.getAt(1);

				if (this.countdown == null) {
					textObject.setText('3');

					let seconds = 2;
					this.countdown = setInterval(() => {
						textObject.setText(seconds+'');

						if (seconds == 0) {
							this.scene.stop();
							this.scene.resume('Game');

							clearInterval(this.countdown);
						} else {
							seconds--;
						}
					}, 1000);
				} else {
					textObject.setText('Resume');

					clearInterval(this.countdown);
					this.countdown = null;
				}
			}
		);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			270,
			this.menuButton,
			'button-pixel-red',
			'Menu',
			() => {
				// not implemented yet
			}
		);
	}

	public update(time: number): void {}
}