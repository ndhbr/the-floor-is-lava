import * as Phaser from 'phaser';
import { RoomService } from '../services/room';
import { ScoreService } from '../services/score';
import { PlayerService } from '../services/player';
import { LavaService } from '../services/lava';
import { PlatformService } from '../services/platform';
import { Room } from '../enums/rooms';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {

	roomService: RoomService;
	scoreService: ScoreService;
	playerService: PlayerService;
	lavaService: LavaService;
	livingRoomPlatformService: PlatformService;
	basementPlatformService: PlatformService;

	gameOver: boolean;
	pauseButton: Phaser.GameObjects.TileSprite;
	space: Phaser.Input.Keyboard.Key;

	lastTextUpdate: number;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
		this.lastTextUpdate = 0;

		this.roomService = new RoomService(this);
		this.scoreService = new ScoreService(this);
		this.playerService = new PlayerService(this);
		this.lavaService = new LavaService(this);
		this.livingRoomPlatformService = new PlatformService(this, Room.LIVING_ROOM);
		this.basementPlatformService = new PlatformService(this, Room.BASEMENT);
	}

    public preload(): void {}

    public create(): void {
		// Activate lights
		// var light  = this.lights.addLight(500, 250, 200);
		// this.input.on('pointermove', function (pointer) {
		// 	light.x = pointer.x;
		// 	light.y = pointer.y;
		// });
		this.lights.enable().setAmbientColor(0xaaaaaa);

		// console.log(this.lights.getMaxVisibleLights());

		// Room Design
		this.roomService.drawBackgrounds();

		// Score
		this.scoreService.initScoreText();

		// Player
		this.playerService.setPlayerJumps(0);
		this.playerService.addPlayer();
		this.playerService.animate();

		// Lava
		this.lavaService.init(Room.BASEMENT);
		this.lavaService.init(Room.LIVING_ROOM);
		this.roomService.drawFloors();
		this.roomService.drawCeilingLamps();
		this.lavaService.animate();

		// Start Platform
		if (this.playerService.getCurrentRoom() == Room.BASEMENT)
			this.basementPlatformService.addStartPlatform();
		else if (this.playerService.getCurrentRoom() == Room.LIVING_ROOM)
			this.livingRoomPlatformService.addStartPlatform();

		// Collider
		this.basementPlatformService.addCollider(this.playerService.getPlayer());
		this.livingRoomPlatformService.addCollider(this.playerService.getPlayer());

		this.lavaService.addLavaParticles();

		this.pauseButton = this.add.tileSprite(32, 32, 32, 32, 'pauseButton');
		this.pauseButton.setInteractive();
		this.pauseButton.on('pointerdown', () => {
			this.pauseGame();
		}, this);

		// Controls
		this.input.on('pointerdown', () => this.playerService.jump(), this);

		// Events
		this.events.on('resume', (sys: Phaser.Scenes.Systems,
			data?: {action: string; }) => {
			this.scoreService.setVisibility(true);

			this.pauseButton.setFrame(0);
			this.pauseButton.setVisible(true);

			if (data != null && data.action == 'continue') {
				this.playerService.resetPosition();

				if (this.playerService.getCurrentRoom() == Room.LIVING_ROOM) {
					this.livingRoomPlatformService.clearPlatforms();
					this.livingRoomPlatformService.addStartPlatform();
				} else if (this.playerService.getCurrentRoom() == Room.BASEMENT) {
					this.basementPlatformService.clearPlatforms();
					this.basementPlatformService.addStartPlatform();
				}
			}
		});
	}

    public update(time: number): void {
		// let a = performance.now();

		if (!this.gameOver) {
			if ((this.playerService.getBounds().y > this.physics.world.bounds.bottom + this.playerService.getBounds().height)
				|| (this.playerService.getBounds().x < -this.playerService.getBounds().width)) {
				this.setGameOver(true);
			}

			// if (this.scoreService.getScore() > 500 &&
			// 	this.playerService.getCurrentRoom() != Room.LIVING_ROOM) {

			// 	this.playerService.setRoom(Room.LIVING_ROOM);
			// }


			this.basementPlatformService.update();
			this.livingRoomPlatformService.update();

			this.lavaService.updateLavaParticles();
			this.roomService.updateTilePositions();


			if (time - this.lastTextUpdate > 10) {
				this.scoreService.incrementScore();
				this.lastTextUpdate = time;
			}
		} else {
			this.setGameOver(false);

			this.scoreService.setVisibility(false);
			this.pauseButton.setVisible(false);

			this.scene.launch('GameOverMenu', {score: this.scoreService.getScore()});
			this.scene.pause();
		}

		// console.log(performance.now() - a);
	}

	public pauseGame() {
		this.scene.launch('PauseMenu');
		this.pauseButton.setFrame(1);
		this.scene.pause('Game');
	}

	private setGameOver(gameOver: boolean) {
		this.gameOver = gameOver;
	}
}