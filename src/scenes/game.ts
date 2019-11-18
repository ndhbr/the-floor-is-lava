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
	pause: boolean;
	pauseButton: Phaser.GameObjects.TileSprite;
	space: Phaser.Input.Keyboard.Key;

    constructor() {
        super(sceneConfig);
    }

    public init(data: any): void {
		this.pause = false;

		this.roomService = new RoomService(this);
		this.scoreService = new ScoreService(this);
		this.playerService = new PlayerService(this);
		this.lavaService = new LavaService(this);
		this.platformService = new PlatformService(this);
	}

    public preload(): void {
		this.load.spritesheet('player', 'assets/player.png',
			{ frameWidth: 64, frameHeight: 64 });

		// this.load.spritesheet('lava',
		// 	'assets/lava-45px.png',
		// 	{ frameWidth: 45, frameHeight: 16 });
		// this.load.image('lava', 'assets/lava.png');
		this.load.spritesheet('lava', 'assets/lava-animated.png',
			{ frameWidth: 32, frameHeight: 32 });

		this.load.spritesheet('pauseButton', 'assets/play-pause-buttons.png',
			{ frameWidth: 32, frameHeight: 32 });

		this.load.image('particle', 'assets/lava-particle.png');

		this.load.image('platform', 'assets/new-platform.png');
		this.load.image('concrete', 'assets/concrete.png');
		this.load.image('concreteWithLava', 'assets/concrete-with-lava.png');
		this.load.image('concreteWithRoof', 'assets/concrete-with-roof.png');
		this.load.image('table', 'assets/table.png');
		this.load.image('couch', 'assets/couch.png');
		this.load.image('floor', 'assets/floor.png');
		this.load.image('cobblestone', 'assets/cobblestone.png');
		this.load.image('wood', 'assets/wood.png');
		this.load.image('woodDark', 'assets/wood-dark.png');
		this.load.image('startPlatform', 'assets/start-platform.png');
	}

    public create(): void {

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
		this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, true);
		this.input.on('pointerdown', () => this.playerService.jump(), this);
	}

    public update(time: number): void {
		this.playerService.enableDoubleJump();
		this.pauseButton.setFrame(0);

		if (!this.gameOver) {
			if (this.playerService.getBounds().y > this.physics.world.bounds.bottom + this.playerService.getBounds().height) {
				this.setGameOver(true);
			}

			if (this.space.isDown) {
				this.playerService.jump();
			}

			this.playerService.animate();

			this.platformService.update();

			this.lavaService.updateLavaParticles();
			this.scoreService.incrementScore();
			this.roomService.updateTilePositions();
		} else {
			this.playerService.resetPosition();

			this.platformService.addStartPlatform();
			this.platformService.clearPlatforms();

			this.scoreService.resetScore();

			this.setGameOver(false);
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