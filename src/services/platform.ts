const DEFAULT_SPEED = -350;

export class PlatformService {

	private platformGroup: Phaser.GameObjects.Group;
	private platformPool: Phaser.GameObjects.Group;
	private nextPlatformDistance: number;

	private startPlatform: Phaser.GameObjects.TileSprite | any;
	private textureCounter: number;

	private platformSpeed: number;

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

		// this.nextPlatformDistance = Phaser.Math.Between(50, 250);
		this.textureCounter = 0;
		this.platformSpeed = DEFAULT_SPEED;
	}

	update() {
		this.nextPlatformDistance = Phaser.Math.Between(64, 500);

		let minDistance = this.scene.physics.world.bounds.width;

		this.platformGroup.getChildren().forEach((platform: Phaser.Physics.Arcade.Sprite) => {
			let platformDistance = this.scene.physics.world.bounds.width - platform.x - platform.displayWidth / 2;

			// minDistance = Math.min(minDistance, platformDistance);
			minDistance = (platformDistance < minDistance) ? platformDistance : minDistance;

			if (platform.x < -platform.displayWidth / 2) {
				this.platformGroup.killAndHide(platform);
				this.platformGroup.remove(platform);
			} else {
				// platform.setVelocityX(this.platformSpeed);
			}
		}, this);

		if (minDistance > this.nextPlatformDistance) {
			this.addPlatform();
		}

		this.checkStartPlatform();
		// this.startPlatform.body.setVelocityX(this.platformSpeed);

		// if (this.platformSpeed > -450)
			// this.platformSpeed -= 0.1;
	}

	private addPlatform() {
		let platform: Phaser.Physics.Arcade.Sprite;
		let positionX = this.scene.physics.world.bounds.width;

		if (this.platformPool.getLength()) {
			platform = this.platformPool.getFirst();

			positionX += platform.displayWidth / 2;

			platform.setX(positionX);
			// platform.setVelocityX(this.platformSpeed);
			platform.setActive(true);
			platform.setVisible(true);

			this.platformPool.remove(platform);
		} else {
			const textures = ['table', 'couch', 'bed'];
			const random = 1;

			this.textureCounter += random;

			if (this.textureCounter > textures.length-1)
				this.textureCounter = 0;

			platform = this.scene.physics.add.sprite(
				positionX,
				this.scene.physics.world.bounds.bottom - 16 - 32,
				textures[this.textureCounter]
			);
			positionX +=  platform.displayWidth / 2;
			platform.setX(positionX);
			platform.setImmovable(true);
			platform.setVelocityX(this.platformSpeed);

			this.platformGroup.add(platform);
		}
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
			body.setVelocityX(this.platformSpeed);
		} else {
			this.startPlatform.setX(this.scene.physics.world.bounds.centerX);
			this.startPlatform.body.setVelocityX(this.platformSpeed);
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