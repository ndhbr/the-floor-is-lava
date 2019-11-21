import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOverMenu',
};

export class GameOverMenuScene extends Phaser.Scene {

	heading: Phaser.GameObjects.Text;
	backdrop: Phaser.GameObjects.Rectangle;

	buttonService: ButtonService;

	resumeButton: Phaser.GameObjects.Container;
	menuButton: Phaser.GameObjects.Container;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.buttonService = new ButtonService(this);
	}

	public preload(): void {
		this.load.spritesheet('button-pixel-red', 'assets/buttons-pixel-red.png',
			{ frameWidth: 125, frameHeight: 27 })
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
			'Game over!', {
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
			'Play again',
			(button: Phaser.GameObjects.Container) => {
				this.scene.stop();
				this.scene.start('Game');
			}
		);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			340,
			this.resumeButton,
			'button-pixel-red',
			'Continue (Video)',
			(button: Phaser.GameObjects.Container) => {
				this.scene.stop();
				this.scene.resume('Game', {action: 'continue'});
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