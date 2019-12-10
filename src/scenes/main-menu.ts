import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';
import { LavaService } from '../services/lava';
import { Room } from '../enums/rooms';
import { RoomService } from '../services/room';
import { SoundService } from '../services/sound';
import { Animations } from '../services/animations';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {

	heading: Phaser.GameObjects.Sprite;
	highscore: DefaultText;
	playButton: Phaser.GameObjects.Container;
	leaderboardButton: Phaser.GameObjects.Container;

	buttonService: ButtonService;
	lavaService: LavaService;
	roomService: RoomService;
	soundService: SoundService;

	constructor() {
		super(sceneConfig);
	}

	public init(data: any): void {
		this.buttonService = new ButtonService(this);
		this.lavaService = new LavaService(this);
		this.roomService = new RoomService(this);
		this.soundService = new SoundService(this);
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

		this.buttonService.generateButton(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.bottom - 200,
			this.playButton,
			'button-pixel-orange',
			'Play',
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
			'Leaderboard',
			(button: Phaser.GameObjects.Container) => {
				this.showLeaderboard();
			}
		);

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
			`Highscore: ${playerEntry.getScore()}`,
			32
		);
		this.highscore.setOrigin(0.5, 0.5);

		Animations.weirdFadeIn(this, this.highscore);
	}

	private async showLeaderboard() {
		this.scene.launch('Leaderboard');
	}
}