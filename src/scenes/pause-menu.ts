import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';
import { SoundService } from '../services/sound';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'PauseMenu',
};

export class PauseMenuScene extends Phaser.Scene {

	heading: DefaultText;
	backdrop: Phaser.GameObjects.Rectangle;

	buttonService: ButtonService;
	soundService: SoundService;

	resumeButton: Phaser.GameObjects.Container;
	menuButton: Phaser.GameObjects.Container;

	countdown: NodeJS.Timeout;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.buttonService = new ButtonService(this);
		this.soundService = new SoundService(this);
	}

	public preload(): void {}

	public create(): void {
		this.backdrop = this.add.rectangle(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY,
			this.physics.world.bounds.width,
			this.physics.world.bounds.height,
			0x000000,
			0.6
		);

		this.heading = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			100,
			'Pause',
			32
		);

		this.heading.setOrigin(0.5, 0.5);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			200,
			this.resumeButton,
			'button-pixel-orange',
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
			'button-pixel-orange',
			'Menu',
			() => {
				this.scene.stop();
				this.scene.stop('Game');
				this.scene.start('MainMenu');
			}
		);

		this.soundService.addSoundButton();
	}

	public update(time: number): void {}
}