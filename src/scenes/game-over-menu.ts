import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOverMenu',
};

export class GameOverMenuScene extends Phaser.Scene {

	backdrop: Phaser.GameObjects.Rectangle;

	heading: DefaultText;
	score: DefaultText;

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

		this.heading = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			100,
			'Game Over',
			32
		);
		this.heading.setOrigin(0.5, 0.5);

		this.score = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			174,
			`${data.score}m`,
			64
		);
		this.score.setOrigin(0.5, 0.5);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			270,
			this.resumeButton,
			'button-pixel-orange',
			'Continue (Video)',
			(button: Phaser.GameObjects.Container) => {
				this.scene.stop();
				this.scene.resume('Game', {action: 'continue'});
			}
		);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			360,
			this.resumeButton,
			'button-pixel-orange',
			'Play again',
			(button: Phaser.GameObjects.Container) => {
				this.scene.stop();
				this.scene.stop('Game');
				this.scene.start('Game');
			}
		);


		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			430,
			this.menuButton,
			'button-pixel-orange',
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