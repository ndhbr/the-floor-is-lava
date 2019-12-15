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

	enteredPortal: Phaser.Events.EventEmitter;
	performanceTest: Array<number> = [];

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

	globalLeaderboard: any;
	contextLeaderboard: any;

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

		if(this.enteredPortal == null) {
			this.enteredPortal = this.events.addListener('onEnteredPortal', () => {
				this.toggleRoom();
			});
		}

		if (this.globalLeaderboard == null) {
			this.initializeLeaderboard();
		}
	}

    public preload(): void {}

    public create(data: any): void {
		// Activate lights
		this.lights.enable().setAmbientColor(0xaaaaaa);

		// Room Design
		this.roomService.drawBackgrounds();

		// Score
		this.scoreService.initScoreText();

		// Player
		this.playerService.setPlayerJumps(0);
		this.playerService.addPlayer(data.playerKey);

		// Lava
		this.lavaService.init(Room.BASEMENT);
		this.lavaService.init(Room.LIVING_ROOM);
		this.roomService.drawFloors();
		this.roomService.drawCeilingLamps();
		this.lavaService.animate();

		// Start Platform
		this.basementPlatformService.addStartPlatform();
		this.livingRoomPlatformService.addStartPlatform();

		this.basementPlatformService.addPlayer(this.playerService.getPlayer());
		this.livingRoomPlatformService.addPlayer(this.playerService.getPlayer());

		// Collider
		this.basementPlatformService.addCollider(this.playerService.getPlayer());
		this.livingRoomPlatformService.addCollider(this.playerService.getPlayer());
		this.roomService.addCollider(
			this.playerService.getPlayer(),
			this.activateGameOver.bind(this)
		);

		this.lavaService.addLavaParticles();

		this.pauseButton = this.add.tileSprite(32, 32, 32, 32, 'pauseButton');
		this.pauseButton.setDepth(4);
		this.pauseButton.setInteractive();
		this.pauseButton.on('pointerdown', () => {
			this.pauseGame();
		}, this);

		// Controls
		this.initJumpControl();

		// Events
		this.events.on('resume', (sys: Phaser.Scenes.Systems,
			data?: {action: string; }) => {
			this.scoreService.setVisibility(true);

			this.pauseButton.setFrame(0);
			this.pauseButton.setVisible(true);

			if (data != null && data.action == 'continue') {
				if (this.playerService.getCurrentRoom() == Room.LIVING_ROOM) {
					this.livingRoomPlatformService.clearPlatforms();
					this.livingRoomPlatformService.addStartPlatform();
				} else if (this.playerService.getCurrentRoom() == Room.BASEMENT) {
					this.basementPlatformService.clearPlatforms();
					this.basementPlatformService.addStartPlatform();
				}

				this.playerService.resetPosition();
			}
		});

		document.addEventListener('visibilitychange', () => {
			if (this.scene.isActive('Game') && document.visibilityState === 'hidden') {
				this.pauseGame();
			}
		});

		// Countdown
		this.countdown();
	}

    public update(time: number): void {
		let a = performance.now();

		if (!this.gameOver) {
			if (this.playerService.getBounds().x < -this.playerService.getBounds().width) {
				this.activateGameOver();
			}

			this.basementPlatformService.update(this.scoreService.getScore());
			this.livingRoomPlatformService.update(this.scoreService.getScore());

			this.lavaService.updateLavaParticles();
			this.roomService.updateTilePositions();

			this.playerService.update();

			if ((time - this.lastTextUpdate > 10) &&
				(!this.basementPlatformService.startPlatformActive())) {
				this.scoreService.incrementScore();
				this.lastTextUpdate = time;
			}
		} else {
			this.setGameOver(false);

			this.setScore(this.scoreService.getScore());

			this.playerService.die();

			this.scoreService.setVisibility(false);
			this.pauseButton.setVisible(false);

			this.scene.launch('GameOverMenu', {score: this.scoreService.getScore()});
			this.scene.pause();
		}

		this.performanceTest.push(performance.now() - a);
	}

	public countdown() {
		this.scene.launch('Countdown');
		this.scene.pause('Game');
	}

	public pauseGame() {
		this.scene.launch('PauseMenu');
		this.pauseButton.setFrame(1);
		this.scene.pause('Game');
	}

	private setGameOver(gameOver: boolean) {
		this.gameOver = gameOver;
	}

	private toggleRoom(): void {
		let newRoom: Room = this.playerService.toggleRoom();

		if (newRoom == Room.BASEMENT) {
			this.basementPlatformService.clearPlatforms();
			this.basementPlatformService.addStartPlatform();
		} else {
			this.livingRoomPlatformService.clearPlatforms();
			this.livingRoomPlatformService.addStartPlatform();
		}
	}

	private activateGameOver(): void {
		this.setGameOver(true);

		let avg: number = 0;
		for (let i = 0; i < this.performanceTest.length; i++) {
			avg += this.performanceTest[i];
		}

		avg /= this.performanceTest.length;

		console.log(`Average Time spent to update game screen (ms): ${avg}`);
		this.performanceTest = [];
	}

	private initJumpControl() {
		const clickableArea = this.add.rectangle(
			this.physics.world.bounds.centerX,
			this.physics.world.bounds.centerY,
			this.physics.world.bounds.width,
			this.physics.world.bounds.height,
			0x000000,
			0
		);

		clickableArea.setInteractive();
		clickableArea.setDepth(3);

		clickableArea.on('pointerdown', () => {
			this.playerService.jump();
		}, this);

		this.input.keyboard.on('keydown-SPACE', () => {
			this.playerService.jump();
		}, this);
	}

	private async initializeLeaderboard() {
		this.globalLeaderboard = await FBInstant.getLeaderboardAsync('global-score');

		if (FBInstant.context.getID() != null) {
			this.contextLeaderboard = await FBInstant.getLeaderboardAsync(`friends.${FBInstant.context.getID()}`);
		}
	}

	private async setScore(score: number) {
		if (this.globalLeaderboard != null) {
			let result;

			result = await this.globalLeaderboard.setScoreAsync(score);

			if (this.contextLeaderboard != null) {
				result = await this.contextLeaderboard.setScoreAsync(score);

				await FBInstant.updateAsync({
					action: 'LEADERBOARD',
					name: `friends.${FBInstant.context.getID()}`
				});
			}

			return result;
		}

		return null;
	}
}