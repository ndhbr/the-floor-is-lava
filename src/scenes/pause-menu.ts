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
	soundButton: Phaser.GameObjects.Container;

	countdown: NodeJS.Timeout;
	soundActivated: boolean;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.buttonService = new ButtonService(this);

		this.soundActivated = true;
	}

	public preload(): void {
		this.load.spritesheet('button-green', 'assets/buttons-green.png',
			{ frameWidth: 240, frameHeight: 60 });
		this.load.spritesheet('button-red', 'assets/buttons-red.png',
			{ frameWidth: 240, frameHeight: 60 });
		this.load.spritesheet('button-pixel-red', 'assets/buttons-pixel-red.png',
			{ frameWidth: 125, frameHeight: 27 });
		this.load.spritesheet('button-pixel-red-sound', 'assets/buttons-pixel-red-sound.png',
			{ frameWidth: 32, frameHeight: 32 });
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
				fontFamily: 'VT323, Roboto, Calibri, sans-serif',
				fontSize: '32px'
			}
		);
		this.heading.setShadow(2, 3, 'rgba(0,0,0,0.5)', 1);
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
							this.countdown = null;
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

		this.buttonService.generateButton(
			this.physics.world.bounds.right - 50,
			this.physics.world.bounds.bottom - 50,
			this.soundButton,
			'button-pixel-red-sound',
			'',
			(button: Phaser.GameObjects.Container) => {
				let btn = <Phaser.GameObjects.Sprite> button.getAt(0);

				if (this.soundActivated) {
					btn.setFrame(2);
					this.soundActivated = false;
				} else {
					btn.setFrame(0);
					this.soundActivated = true;
				}
			}
		)
	}

	public update(time: number): void {}
}