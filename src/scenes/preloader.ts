import * as Phaser from 'phaser';
import { SoundService } from '../services/sound';
import { DefaultText } from '../classes/default-text';
import { TranslateService } from '../services/translate';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
};

export class PreloaderScene extends Phaser.Scene {

	soundService: SoundService;
	translateService: TranslateService;

	constructor() {
		super(sceneConfig);
	}

	public preload(): void {
		this.facebook.once('startgame', this.startGame, this);
		this.facebook.showLoadProgress(this);

		this.load.spritesheet('playerCrocodile', 'assets/player-crocodile.png',
			{ frameWidth: 48, frameHeight: 64 });
		this.load.spritesheet('playerLion', 'assets/player-lion.png',
			{ frameWidth: 48, frameHeight: 64 });
		this.load.spritesheet('playerNinja', 'assets/player-ninja.png',
			{ frameWidth: 48, frameHeight: 64 });
		this.load.spritesheet('lava', 'assets/lava-animated.png',
			{ frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('button-pixel-orange', 'assets/buttons-pixel-orange.png',
			{ frameWidth: 125, frameHeight: 27 });
		this.load.spritesheet('button-pixel-orange-sound', 'assets/buttons-pixel-orange-sound.png',
			{ frameWidth: 24, frameHeight: 24 });
		this.load.spritesheet('button-pixel-orange-share', 'assets/buttons-pixel-orange-share.png',
			{ frameWidth: 24, frameHeight: 24 });
		this.load.spritesheet('portal', 'assets/portal.png',
			{ frameWidth: 64, frameHeight: 16 });

		this.load.image('playerComingSoon', 'assets/player-coming-soon.png');
		this.load.image('ceilingLamp', 'assets/ceiling-lamp.png');
		this.load.image('triangle', 'assets/triangle.png');
		this.load.image('closeWithoutBox', 'assets/close-without-box.png');
		this.load.image('heading', 'assets/heading.png');
		this.load.image('particle', 'assets/lava-particle.png');
		this.load.image('concrete', 'assets/concrete.png');
		this.load.image('concreteWithLava', 'assets/concrete-with-lava.png');
		this.load.image('concreteWithRoof', 'assets/concrete-with-roof.png');
		this.load.image('floor', 'assets/floor.png');
		this.load.image('cobblestone', ['assets/cobblestone.png', 'assets/default_map.png']);
		this.load.image('wood', ['assets/wood.png', 'assets/default_map.png']);
		this.load.image('woodDark', 'assets/wood-dark.png');
		this.load.image('backgroundBasement0', 'assets/background-basement-0.png');
		this.load.image('backgroundBasement1', 'assets/background-basement-1.png');
		this.load.image('backgroundLivingRoom0', 'assets/background-livingroom-0.png');
		this.load.image('backgroundLivingRoom1', 'assets/background-livingroom-1.png');

		this.load.bitmapFont('basis33', 'fonts/basis33_0.png', 'fonts/basis33.xml');

		this.load.audio('menuSelect', 'assets/sounds/menu_select.wav');
		// this.load.audio('lava', 'assets/sounds/lava.wav');

		this.preloadActiveLanguageFile();
	}

	public create(): void {
		this.translateService = new TranslateService(this);
		this.soundService = new SoundService(this);

		new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY - 24,
			this.translateService.localise('PRELOADER', 'LOADING'),
			48
		).setOrigin(0.5, 0.5);

		new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY + 24,
			this.translateService.localise('PRELOADER', 'LAVA'),
			32
		).setOrigin(0.5, 0.5);

		this.anims.create({
			key: 'portal',
			frames: this.anims.generateFrameNumbers('portal', {start: 0, end: 1}),
			frameRate: 10,
			repeat: -1
		});

		this.addPlayerAnimations('playerLion');
		this.addPlayerAnimations('playerCrocodile');
		this.addPlayerAnimations('playerNinja');
	}

	public startGame(): void {
		this.scene.start('MainMenu');
	}

	private preloadActiveLanguageFile() {
		let language = FBInstant.getLocale();
		language = language.substr(0, 2).toLowerCase();

		switch(language) {
			case 'de':
			case 'en':
			case 'fr':
			case 'es':
				break;
			default:
				language = 'en';
				break;
		}

		this.load.json('language-file', `assets/lang/${language}.json`);
	}

	private addPlayerAnimations(key: string)
	{
		this.anims.create({
			key: `run-${key}`,
			frames: this.anims.generateFrameNumbers(key, {start: 0, end: 4}),
			frameRate: 12,
			repeat: -1
		});

		this.anims.create({
			key: `dizzy-${key}`,
			frames: this.anims.generateFrameNumbers(key, {start: 7, end: 8}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: `die-${key}`,
			frames: this.anims.generateFrameNumbers(key, {start: 9, end: 10}),
			frameRate: 2,
			repeat: 0
		});

		this.anims.create({
			key: `standing-${key}`,
			frames: this.anims.generateFrameNumbers(key, {start: 11, end: 12}),
			frameRate: 4,
			repeat: -1
		});
	}
}