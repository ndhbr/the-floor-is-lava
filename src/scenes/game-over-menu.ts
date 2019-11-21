import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOverMenu',
};

export class GameOverMenuScene extends Phaser.Scene {

	backdrop: Phaser.GameObjects.Rectangle;

	heading: Phaser.GameObjects.Text;
	score: Phaser.GameObjects.Text;

	buttonService: ButtonService;

	resumeButton: Phaser.GameObjects.Container;
	menuButton: Phaser.GameObjects.Container;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.buttonService = new ButtonService(this);
	}

	public preload(): void {}

	public create(data: {score: number}): void {
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
			'Game Over', {
				fontFamily: 'VT323, Roboto, Calibri, sans-serif',
				fontSize: '32px'
			}
		);
		this.heading.setOrigin(0.5, 0.5);
		this.heading.setShadow(2, 3, 'rgba(0,0,0,0.5)', 1);

		this.score = this.add.text(
			this.physics.world.bounds.centerX,
			164,
			`${data.score}m`, {
				fontFamily: 'VT323, Roboto, Calibri, sans-serif',
				fontSize: '64px'
			}
		);
		this.score.setOrigin(0.5, 0.5);
		this.score.setShadow(2, 3, 'rgba(0,0,0,0.5)', 1);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			270,
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
			340,
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
			410,
			this.menuButton,
			'button-pixel-red',
			'Menu',
			() => {
				this.scene.stop();
				this.scene.stop('Game');
				this.scene.start('MainMenu');
			}
		);
	}

	public update(time: number): void {}
}