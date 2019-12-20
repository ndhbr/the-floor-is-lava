import * as Phaser from 'phaser';
import { DefaultText } from '../classes/default-text';
import { TranslateService } from '../services/translate';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Loading',
};

export class LoadingScene extends Phaser.Scene {

	translateService: TranslateService;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.translateService = new TranslateService(this);
	}

	public create(): void {
		const backdrop = this.add.rectangle(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY,
			this.physics.world.bounds.width,
			this.physics.world.bounds.height,
			0x000000,
			0.6
		).setInteractive();
		backdrop.on('pointerdown', () => {});

		const player = this.add.sprite(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY - 32,
			'playerCrocodile',
			0
		);
		player.anims.play('run-playerCrocodile');

		const loading = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY + 32,
			this.translateService.localise('LOADING', 'LOADING'),
			32,
			1
		);
		loading.setOrigin(0.5, 0.5);
	}
}