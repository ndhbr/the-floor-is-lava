import * as Phaser from 'phaser';
import { SoundService } from '../services/sound';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
};

export class PreloaderScene extends Phaser.Scene {

	soundService: SoundService;

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
		this.load.spritesheet('pauseButton', 'assets/play-pause-buttons.png',
			{ frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('button-pixel-orange', 'assets/buttons-pixel-orange.png',
			{ frameWidth: 125, frameHeight: 27 });
		this.load.spritesheet('button-pixel-orange-small', 'assets/buttons-pixel-orange-small.png',
			{ frameWidth: 47, frameHeight: 21 });
		this.load.spritesheet('button-pixel-orange-sound', 'assets/buttons-pixel-orange-sound.png',
			{ frameWidth: 24, frameHeight: 24 });
		this.load.spritesheet('close', 'assets/close.png',
			{ frameWidth: 24, frameHeight: 24 });
		this.load.spritesheet('portal', 'assets/portal.png',
			{ frameWidth: 64, frameHeight: 16 });

		this.load.image('triangle', 'assets/triangle.png');
		this.load.image('closeWithoutBox', 'assets/close-without-box.png');
		this.load.image('heading', 'assets/heading.png');
		this.load.image('particle', 'assets/lava-particle.png');
		this.load.image('concrete', 'assets/concrete.png');
		this.load.image('concreteWithLava', 'assets/concrete-with-lava.png');
		this.load.image('concreteWithRoof', 'assets/concrete-with-roof.png');
		this.load.image('table', 'assets/table.png');
		this.load.image('couch', 'assets/couch.png');
		this.load.image('bed', 'assets/bed.png');
		this.load.image('cactus', 'assets/cactus.png');
		this.load.image('ceilingLamp', 'assets/ceiling-lamp.png');
		this.load.image('closet', 'assets/closet.png');
		this.load.image('floor', 'assets/floor.png');
		this.load.image('cobblestone', ['assets/cobblestone.png', 'assets/default_map.png']);
		this.load.image('wood', ['assets/wood.png', 'assets/default_map.png']);
		this.load.image('woodDark', 'assets/wood-dark.png');
		this.load.image('startPlatform', 'assets/start-platform.png');
		this.load.image('box', 'assets/box.png');
		this.load.image('stove', 'assets/stove.png');
		this.load.image('barrels', 'assets/barrels.png');
		this.load.image('wineShelf', 'assets/wine-shelf.png');
		this.load.image('leaderboardBadge', 'assets/leaderboard-badge.png');
		this.load.image('backgroundBasement0', 'assets/background-basement-0.png');
		this.load.image('backgroundBasement1', 'assets/background-basement-1.png');
		this.load.image('backgroundLivingRoom0', 'assets/background-livingroom-0.png');
		this.load.image('backgroundLivingRoom1', 'assets/background-livingroom-1.png');

		this.load.bitmapFont('basis33', 'fonts/basis33_0.png', 'fonts/basis33.xml');

		this.load.audio('hit', 'assets/sounds/hit.wav');
		this.load.audio('jump', 'assets/sounds/jump.wav');
		this.load.audio('menuSelect', 'assets/sounds/menu_select.wav');
		this.load.audio('portal', 'assets/sounds/portal.wav');
		// this.load.audio('lava', 'assets/sounds/lava.wav');
		this.load.audio('death', 'assets/sounds/death.mp3');

		this.preloadActiveLanguageFile();
	}

	public create(): void {
		this.soundService = new SoundService(this);

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