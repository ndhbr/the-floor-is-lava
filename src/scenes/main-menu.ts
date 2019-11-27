import * as Phaser from 'phaser';
import { ButtonService } from '../services/button';
import { DefaultText } from '../classes/default-text';
import { LavaService } from '../services/lava';
import { Room } from '../enums/rooms';
import { RoomService } from '../services/room';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {

	heading: Phaser.GameObjects.Sprite;
	playButton: Phaser.GameObjects.Container;
	leaderboardButton: Phaser.GameObjects.Container;

	buttonService: ButtonService;
	lavaService: LavaService;
	roomService: RoomService;

	constructor() {
		super(sceneConfig);
	}

	public init(): void {
		this.buttonService = new ButtonService(this);
		this.lavaService = new LavaService(this);
		this.roomService = new RoomService(this);
	}

	public preload(): void {}

	public create(data: any): void {
		this.roomService.drawBackgrounds();

		this.lavaService.init(Room.BASEMENT);
		this.lavaService.init(Room.LIVING_ROOM);
		this.lavaService.animate();

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
				// TODO: Leaderboard
			}
		);
	}

	public update(time: number): void {}
}