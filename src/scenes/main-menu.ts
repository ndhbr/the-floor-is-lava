import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {

	heading: Phaser.GameObjects.Text;
	playButton: Phaser.GameObjects.Container;
	leaderboardButton: Phaser.GameObjects.Container;

	buttonService: ButtonService;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.buttonService = new ButtonService(this);
	}

	public preload(): void {}

	public create(data: any): void {
		this.heading = this.add.text(
			this.physics.world.bounds.centerX,
			100,
			'The Floor Is Lava', {
				fontFamily: 'VT323, Roboto, Calibri, sans-serif',
				fontSize: '32px'
			}
		);
		this.heading.setOrigin(0.5, 0.5);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			200,
			this.playButton,
			'button-pixel-red',
			'Play',
			(button: Phaser.GameObjects.Container) => {
				this.scene.stop();
				this.scene.start('Game');
			}
		);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			270,
			this.leaderboardButton,
			'button-pixel-red',
			'Leaderboard',
			(button: Phaser.GameObjects.Container) => {
				// TODO: Leaderboard
			}
		);
	}

	public update(time: number): void {}
}