import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';
import { SoundService } from '../services/sound';
import { TranslateService } from '../services/translate';
import { AdService } from '../services/ad';
import { DialogService } from '../services/dialog';
import { Scene } from '../interfaces/scene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOverMenu',
};

export class GameOverMenuScene extends Phaser.Scene implements Scene {

	backdrop: Phaser.GameObjects.Rectangle;

	heading: DefaultText;
	score: DefaultText;

	buttonService: ButtonService;
	soundService: SoundService;
	translateService: TranslateService;
	dialogService: DialogService;

	resumeButton: Phaser.GameObjects.Container;
	menuButton: Phaser.GameObjects.Container;

	videoAd: FBInstant.AdInstance;
	interstitialAd: FBInstant.AdInstance;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.buttonService = new ButtonService(this);
		this.soundService = new SoundService(this);
		this.translateService = new TranslateService(this);
		this.dialogService = new DialogService(this);
	}

	public preload(): void {}

	public create(data: {score: number}): void {
		this.loadAds();

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
			this.translateService.localise('GAME_OVER_MENU', 'CONTINUE'),
			async (button: Phaser.GameObjects.Container) => {
				await AdService.showRewardedVideo(this.videoAd);
				this.scene.stop();
				this.scene.resume('Game', {action: 'continue'});
			}
		);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			360,
			this.resumeButton,
			'button-pixel-orange',
			this.translateService.localise('GAME_OVER_MENU', 'PLAY_AGAIN'),
			async (button: Phaser.GameObjects.Container) => {
				// await AdService.showInterstitial(this.interstitialAd);

				this.scene.stop();
				this.scene.stop('Game');
				this.scene.start('Game');
			}
		);

		let menuDialog: Phaser.GameObjects.Container;
		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			430,
			this.menuButton,
			'button-pixel-orange',
			this.translateService.localise('GAME_OVER_MENU', 'MENU'),
			async () => {
				if (menuDialog == null) {
					menuDialog = await this.dialogService.add(
						this.translateService.localise('DIALOG', 'ARE_YOU_SURE'),
						this.translateService.localise('DIALOG', 'SCORE_WILL_BE_LOST'),
						this.translateService.localise('DIALOG', 'YES'),
						() => {
							this.scene.stop();
							this.scene.stop('Game');
							this.scene.start('MainMenu');
						},
						this.translateService.localise('DIALOG', 'CANCEL'),
					);
				} else {
					this.dialogService.restoreDialog(menuDialog);
				}
			}
		);

		this.soundService.addSoundButton();
		this.playBackgroundMusic();
	}

	public update(time: number): void {}

	private async loadAds() {
		this.videoAd = await AdService.loadRewardedVideo();
		this.interstitialAd = await AdService.loadInterstitial();
	}

	playBackgroundMusic() {
		this.sound.stopAll();
		this.sound.play('8Bit_1', {loop: true, volume: 0.2});
	}
}