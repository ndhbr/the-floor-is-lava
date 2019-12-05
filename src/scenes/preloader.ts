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

		this.load.spritesheet('button-pixel-orange', 'assets/buttons-pixel-orange.png',
			{ frameWidth: 125, frameHeight: 27 });

		this.load.spritesheet('button-pixel-red-sound', 'assets/buttons-pixel-red-sound.png',
			{ frameWidth: 32, frameHeight: 32 });

		this.load.spritesheet('button-pixel-orange-sound', 'assets/buttons-pixel-orange-sound.png',
			{ frameWidth: 32, frameHeight: 32 });

		this.load.spritesheet('portal', 'assets/portal.png',
			{ frameWidth: 64, frameHeight: 16 });

		this.load.image('heading', 'assets/heading.png');
		this.load.image('particle', 'assets/lava-particle.png');
		this.load.image('portalParticle', 'assets/portal-particle.png');
		this.load.image('platform', 'assets/new-platform.png');
		this.load.image('concrete', 'assets/concrete.png');
		this.load.image('concreteWithLava', 'assets/concrete-with-lava.png');
		this.load.image('concreteWithRoof', 'assets/concrete-with-roof.png');
		this.load.image('table', 'assets/table.png');
		this.load.image('couch', 'assets/couch.png');
		this.load.image('bed', 'assets/bed.png');
		this.load.image('lamp', 'assets/lamp.png');
		this.load.image('cactus', 'assets/cactus.png');
		this.load.image('ceilingLamp', 'assets/ceiling-lamp.png');
		this.load.image('closet', 'assets/closet.png');
		this.load.image('floor', 'assets/floor.png');
		this.load.image('cobblestone', ['assets/cobblestone.png', 'assets/default_map.png']);
		this.load.image('wood', ['assets/wood.png', 'assets/default_map.png']);
		this.load.image('woodDark', 'assets/wood-dark.png');
		this.load.image('startPlatform', 'assets/start-platform.png');
		this.load.image('box', 'assets/box.png');
		this.load.image('barrels', 'assets/barrels.png');
		this.load.image('wineShelf', 'assets/wine-shelf.png');

		this.load.bitmapFont('basis33', 'fonts/basis33_0.png', 'fonts/basis33.xml');
	}

	public create(): void {
		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers('player', {start: 0, end: 7}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'portal',
			frames: this.anims.generateFrameNumbers('portal', {start: 0, end: 1}),
			frameRate: 10,
			repeat: -1
		});

		this.scene.start('MainMenu');
	}
}