const PLATFORM_SPEED = -350;

export class PlatformService {

	private platformGroup: Phaser.GameObjects.Group;
	private platformPool: Phaser.GameObjects.Group;
	private nextPlatformDistance: number;

	private startPlatform: Phaser.GameObjects.TileSprite | any;

	constructor(private scene: Phaser.Scene) {
		this.platformGroup = this.scene.add.group({
			removeCallback: (platform) => {
				this.platformPool.add(platform);
			}
		});

		this.platformPool = this.scene.add.group({
			removeCallback: (platform) => {
				this.platformGroup.add(platform);
			}
		});

		// this.nextPlatformDistance = Phaser.Math.Between(64, 250);
		this.nextPlatformDistance = 180;
	}

	pauseGame(pause?: boolean) {
		if (pause == null)
			pause = false;

		this.platformGroup.getChildren().forEach((platform: Phaser.Physics.Arcade.Sprite) => {
			if (pause) {
				platform.setVelocityX(0);
			} else {
				platform.setVelocityX(PLATFORM_SPEED);
			}
		});

		if (pause) {
			this.startPlatform.body.setVelocityX(0);
		} else {
			this.startPlatform.body.setVelocityX(PLATFORM_SPEED);
		}
	}

	update() {
		let minDistance = this.scene.physics.world.bounds.width;
		this.platformGroup.getChildren().forEach((platform: Phaser.Physics.Arcade.Sprite) => {
			let platformDistance = this.scene.physics.world.bounds.width - platform.x - platform.displayWidth / 2;

			minDistance = Math.min(minDistance, platformDistance);

			if (platform.x < -platform.displayWidth / 2) {
				this.platformGroup.killAndHide(platform);
				this.platformGroup.remove(platform);
			}
		}, this);

		if (minDistance > this.nextPlatformDistance) {
			let nextPlatformWidth = Phaser.Math.Between(64, 250);
			this.addPlatform(nextPlatformWidth, this.scene.physics.world.bounds.width + nextPlatformWidth / 2);
		}

		this.checkStartPlatform();
	}

	private addPlatform(platformWidth: number, positionX: number) {
		let platform: Phaser.Physics.Arcade.Sprite;

		if (this.platformPool.getLength()) {
			platform = this.platformPool.getFirst();

			platform.setX(positionX);
			platform.setActive(true);
			platform.setVisible(true);

			this.platformPool.remove(platform);
		} else {
			const textures = ['table', 'couch'];
			const texture = textures[Phaser.Math.Between(0, 1)];

			platform = this.scene.physics.add.sprite(positionX, this.scene.physics.world.bounds.bottom - 16 - 32, texture);
			platform.setImmovable(true);
			platform.setVelocityX(PLATFORM_SPEED);

			this.platformGroup.add(platform);
		}

		platform.displayWidth = platformWidth;
	}

	addStartPlatform(): void {
		if (this.startPlatform == null) {
			this.startPlatform = this.scene.add.tileSprite(
				this.scene.physics.world.bounds.centerX,
				this.scene.physics.world.bounds.bottom - 16 - 32,
				this.scene.physics.world.bounds.width,
				32,
				'startPlatform'
			);
			this.startPlatform.depth = 2;

			this.scene.physics.add.existing(this.startPlatform);

			let body: Phaser.Physics.Arcade.Body = this.startPlatform.body;

			body.setEnable();
			body.setImmovable(true);
			body.setVelocityX(PLATFORM_SPEED);
		} else {
			this.startPlatform.setX(this.scene.physics.world.bounds.centerX);
			this.startPlatform.setActive(true);
			this.startPlatform.setVisible(true);
		}
	}

	checkStartPlatform(): boolean {
		if (this.startPlatform.x < - this.startPlatform.width / 2) {
			this.startPlatform.setActive(false);
			this.startPlatform.setVisible(false);

			return false;
		}

		return true;
	}

	clearPlatforms(): void {
		this.platformGroup.clear(true, true);
	}

	getPlatformGroup(): Phaser.GameObjects.Group {
		return this.platformGroup;
	}

	getPlatformPool(): Phaser.GameObjects.Group {
		return this.platformPool;
	}

	getStartPlatform(): Phaser.GameObjects.Group {
		return this.startPlatform;
	}
}