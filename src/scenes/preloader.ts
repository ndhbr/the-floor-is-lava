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
		this.load.spritesheet('player', 'assets/player.png',
		{ frameWidth: 64, frameHeight: 64 });

		this.load.spritesheet('lava', 'assets/lava-animated.png',
			{ frameWidth: 32, frameHeight: 32 });

		this.load.spritesheet('pauseButton', 'assets/play-pause-buttons.png',
			{ frameWidth: 32, frameHeight: 32 });

		this.load.spritesheet('button-pixel-red', 'assets/buttons-pixel-red.png',
			{ frameWidth: 125, frameHeight: 27 });

		this.load.spritesheet('button-pixel-red-sound', 'assets/buttons-pixel-red-sound.png',
			{ frameWidth: 32, frameHeight: 32 });

		this.load.image('particle', 'assets/lava-particle.png');
		this.load.image('platform', 'assets/new-platform.png');
		this.load.image('concrete', 'assets/concrete.png');
		this.load.image('concreteWithLava', 'assets/concrete-with-lava.png');
		this.load.image('concreteWithRoof', 'assets/concrete-with-roof.png');
		this.load.image('table', 'assets/table.png');
		this.load.image('couch', 'assets/couch.png');
		this.load.image('bed', 'assets/bed.png');
		this.load.image('floor', 'assets/floor.png');
		this.load.image('cobblestone', ['assets/cobblestone.png', 'assets/default_map.png']);
		this.load.image('wood', 'assets/wood.png');
		this.load.image('woodDark', 'assets/wood-dark.png');
		this.load.image('startPlatform', 'assets/start-platform.png');

		WebFont.load({
			google: {
				families: ['VT323']
			}
		});
	}

	public create(): void {
		this.scene.start('MainMenu');
	}
}