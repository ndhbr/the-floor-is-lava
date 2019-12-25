import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';
import { SoundService } from '../services/sound';
import { TranslateService } from '../services/translate';
import { AdService } from '../services/ad';
import { DialogService } from '../services/dialog';
import { Scene } from '../interfaces/scene';
import { Base64Images } from '../base64-images';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOverMenu',
};

export class GameOverMenuScene extends Phaser.Scene implements Scene {

	backdrop: Phaser.GameObjects.Rectangle;

	heading: DefaultText;
	score: DefaultText;
	scoreNumber: number;

	buttonService: ButtonService;
	soundService: SoundService;
	translateService: TranslateService;
	dialogService: DialogService;

	resumeButton: Phaser.GameObjects.Container;
	menuButton: Phaser.GameObjects.Container;

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

		this.scoreNumber = data.score;
		this.score = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			174,
			`${this.scoreNumber}m`,
			64
		);
		this.score.setOrigin(0.5, 0.5);

		if (AdService.video != null) {
			this.buttonService.generateButton(
				this.physics.world.bounds.centerX,
				270,
				this.resumeButton,
				'button-pixel-orange',
				this.translateService.localise('GAME_OVER_MENU', 'CONTINUE'),
				async (button: Phaser.GameObjects.Container) => {
					try {
						this.scene.launch('Loading');
						await AdService.showRewardedVideo();
						this.scene.stop('Loading');
						this.scene.stop();
						this.scene.resume('Game', {action: 'continue'});
					} catch (error) {
						this.scene.stop('Loading');
					}
				}
			);
		} else {
			console.log('Failed to load video.');
		}

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			360,
			this.resumeButton,
			'button-pixel-orange',
			this.translateService.localise('GAME_OVER_MENU', 'PLAY_AGAIN'),
			async (button: Phaser.GameObjects.Container) => {
				this.scene.stop();
				this.scene.stop('Game');
				this.scene.start('Game');
			}
		);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			430,
			this.resumeButton,
			'button-pixel-orange',
			this.translateService.localise('GAME_OVER_MENU', 'CHALLENGE'),
			async (button: Phaser.GameObjects.Container) => {
				await FBInstant.context.chooseAsync();
			}
		);

		let menuDialog: Phaser.GameObjects.Container;
		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			500,
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
		this.addShareButton();
		this.ads();
	}

	public update(time: number): void {}

	private addShareButton() {
		let buttonContainer: Phaser.GameObjects.Container;
		this.buttonService.generateButton(
			this.physics.world.bounds.right - 110,
			this.physics.world.bounds.bottom - 50,
			buttonContainer,
			'button-pixel-orange-share',
			'',
			async () => {
				await FBInstant.shareAsync({
					intent: 'CHALLENGE',
					image: Base64Images.getShareImage(),
					text: this.translateService.localise('SHARE', 'CHALLENGE')
				});
			}
		);
	}

	playBackgroundMusic() {}

	private async ads() {
		try {
			this.scene.launch('Loading');
			AdService.incrementGameCount();
			AdService.incrementRunDistance(this.scoreNumber);
			await AdService.showInterstitial();
			this.scene.stop('Loading');
		} catch (error) {
			this.scene.stop('Loading');
		}

		AdService.createShortcut();
	}
}