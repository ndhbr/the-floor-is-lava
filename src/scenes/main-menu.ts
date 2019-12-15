import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';
import { LavaService } from '../services/lava';
import { Room } from '../enums/rooms';
import { RoomService } from '../services/room';
import { SoundService } from '../services/sound';
import { Animations } from '../services/animations';
import { TranslateService } from '../services/translate';
import { PlayerSwitch } from '../classes/player-switch';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {

	ready: boolean;
	heading: Phaser.GameObjects.Sprite;
	highscore: DefaultText;
	beatScore: DefaultText;
	playButton: Phaser.GameObjects.Container;
	leaderboardButton: Phaser.GameObjects.Container;

	playerSwitch: PlayerSwitch;

	buttonService: ButtonService;
	lavaService: LavaService;
	roomService: RoomService;
	soundService: SoundService;
	translateService: TranslateService;

	constructor() {
		super(sceneConfig);
	}

	public init(data: any): void {
		this.buttonService = new ButtonService(this);
		this.lavaService = new LavaService(this);
		this.roomService = new RoomService(this);
		this.soundService = new SoundService(this);
		this.translateService = new TranslateService(this);
	}

	public preload(): void {}

	public create(data: any): void {
		this.lights.enable().setAmbientColor(0xaaaaaa);

		this.lavaService.init(Room.BASEMENT);
		this.lavaService.init(Room.LIVING_ROOM);
		this.lavaService.animate();

		this.roomService.drawBackgrounds();
		this.roomService.drawCeilingLamps();
		this.roomService.drawFloors();

		let backdrop = this.add.rectangle(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY,
			this.physics.world.bounds.width,
			this.physics.world.bounds.height,
			0x000000,
			0.6
		);
		backdrop.depth = 4;

		this.heading = this.add.sprite(
			this.physics.world.bounds.centerX,
			140,
			'heading'
		);
		this.heading.setOrigin(0.5, 0.5);
		this.heading.setDepth(4);
		Animations.weirdFadeIn(this, this.heading);

		this.addHighscoreText();
		this.addBeatScoreText();

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.bottom - 200,
			this.playButton,
			'button-pixel-orange',
			this.translateService.localise('MAIN_MENU', 'PLAY'),
			(button: Phaser.GameObjects.Container) => {
				this.scene.stop();
				this.scene.start('Game');
			}
		);

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.bottom - 130,
			this.leaderboardButton,
			'button-pixel-orange',
			this.translateService.localise('MAIN_MENU', 'LEADERBOARD'),
			(button: Phaser.GameObjects.Container) => {
				this.showLeaderboard();
			}
		);

		this.playerSwitch = new PlayerSwitch(this);
		this.soundService.addSoundButton();
	}

	public update(time: number) {
		this.roomService.updateTilePositions();
	}

	private async addHighscoreText() {
		const leaderboard = await FBInstant.getLeaderboardAsync('global-score');
		const playerEntry = await leaderboard.getPlayerEntryAsync();

		this.highscore = new DefaultText(
			this,
			this.physics.world.bounds.centerX,
			220,
			`${this.translateService.localise('MAIN_MENU', 'HIGHSCORE')}:`+
			` ${playerEntry.getScore()}m`,
			32
		);
		this.highscore.setOrigin(0.5, 0.5);

		Animations.weirdFadeIn(this, this.highscore);
	}

	private async addBeatScoreText() {
		if (FBInstant.context.getID() != null) {
			try {
				const leaderboard = await FBInstant.getLeaderboardAsync(`friends.${FBInstant.context.getID()}`);
				const entries = await leaderboard.getEntriesAsync(1, 0);

				if (entries.length > 0) {
					let entry = entries.shift();

					if (entry.getPlayer().getID() != FBInstant.player.getID()) {
						this.beatScore = new DefaultText(
							this,
							this.physics.world.bounds.centerX,
							270,
							`Beat ${entry.getPlayer().getName()}`
							+ `with: ${(entry.getScore()) ? `${entry.getScore()} m` : '0'}`,
							32
						);
						this.beatScore.setOrigin(0.5, 0.5);

						Animations.weirdFadeIn(this, this.beatScore);
					}
				}
			} catch(error) {
				console.error(error);
			}
		}
	}

	private async showLeaderboard() {
		this.scene.launch('Leaderboard');
	}
}