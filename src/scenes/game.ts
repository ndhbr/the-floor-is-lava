import * as Phaser from 'phaser';
import { RoomService } from '../services/room';
import { ScoreService } from '../services/score';
import { PlayerService } from '../services/player';
import { LavaService } from '../services/lava';
import { PlatformService } from '../services/platform';

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

	gameOver: boolean;
	pauseButton: Phaser.GameObjects.TileSprite;
	space: Phaser.Input.Keyboard.Key;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
		this.roomService = new RoomService(this);
		this.scoreService = new ScoreService(this);
		this.playerService = new PlayerService(this);
		this.lavaService = new LavaService(this);
		this.platformService = new PlatformService(this);
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

		// Lava
		this.lavaService.init();
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

			if (data != null && data.action == 'continue') {
				this.platformService.clearPlatforms();
				this.platformService.addStartPlatform();
				this.playerService.resetPosition();
			}
		});
	}

    public update(time: number): void {
		this.pauseButton.setFrame(0);

		if (!this.gameOver) {
			if (this.playerService.getBounds().y > this.physics.world.bounds.bottom + this.playerService.getBounds().height) {
				this.setGameOver(true);
			}

			this.playerService.animate();

			this.platformService.update();

			this.lavaService.updateLavaParticles();
			this.scoreService.incrementScore();
			this.roomService.updateTilePositions();
		} else {
			this.setGameOver(false);
			this.scoreService.setVisibility(false);
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