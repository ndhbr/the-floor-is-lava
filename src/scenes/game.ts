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
	platformService: PlatformService;

	currentRoom: string;
	gameOver: boolean;
	pauseButton: Phaser.GameObjects.TileSprite;
	space: Phaser.Input.Keyboard.Key;

	lastTextUpdate: number;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
		this.roomService = new RoomService(this);
		this.scoreService = new ScoreService(this);
		this.playerService = new PlayerService(this);
		this.lavaService = new LavaService(this);
		this.platformService = new PlatformService(this);

		this.lastTextUpdate = 0;
	}

    public preload(): void {}

    public create(): void {
		// Activate lights
		// var light  = this.lights.addLight(500, 250, 200);
		// this.input.on('pointermove', function (pointer) {
		// 	light.x = pointer.x;
		// 	light.y = pointer.y;
		// });

		// this.lights.enable().setAmbientColor(0x111111);
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
		this.lavaService.animate();

		// Start Platform
		this.platformService.addStartPlatform();

		// Collider
		this.physics.add.collider(
			this.playerService.getPlayer(),
			this.platformService.getPlatformGroup(),
			this.setFriction,
			null,
			this
		);
		this.physics.add.collider(
			this.playerService.getPlayer(),
			this.platformService.getStartPlatform(),
			this.setFriction,
			null,
			this
		);

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
				this.platformService.clearPlatforms();
				this.platformService.addStartPlatform();
				this.playerService.resetPosition();
			}
		});
	}

    public update(time: number): void {
		if (!this.gameOver) {
			if ((this.playerService.getBounds().y > this.physics.world.bounds.bottom + this.playerService.getBounds().height)
				|| (this.playerService.getBounds().x < -this.playerService.getBounds().width)) {
				this.setGameOver(true);
			}

			if (this.scoreService.getScore() > 500 &&
				this.playerService.getCurrentRoom() != Room.LIVING_ROOM) {

				this.playerService.setRoom(Room.LIVING_ROOM);
			}


			this.platformService.update();


			this.lavaService.updateLavaParticles();
			this.roomService.updateTilePositions();

			let a = performance.now();

			if (time - this.lastTextUpdate > 10) {
				this.scoreService.incrementScore();
				this.lastTextUpdate = time;
			}

			console.log(performance.now() - a);
		} else {
			this.setGameOver(false);

			this.scoreService.setVisibility(false);
			this.pauseButton.setVisible(false);

			this.scene.launch('GameOverMenu', {score: this.scoreService.getScore()});
			this.scene.pause();
		}
	}

	public pauseGame() {
		this.scene.launch('PauseMenu');
		this.pauseButton.setFrame(1);
		this.scene.pause('Game');
	}

	private setFriction(player: Phaser.Physics.Arcade.Sprite, platform: any) {
		player.body.x -= platform.body.x - platform.body.prev.x;
	}

	private setGameOver(gameOver: boolean) {
		this.gameOver = gameOver;
	}
}