import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
};

export class PreloaderScene extends Phaser.Scene {

	constructor() {
		super(sceneConfig);
	}

	public preload(): void {
		WebFont.load({
			google: {
				families: ['VT323']
			}
		});
	}

	public create(): void {
		this.scene.start('Game');
	}
}